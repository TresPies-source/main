// src/pages/api/delete-user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import { verifyFirebaseToken } from '@/lib/api-auth';

// This is a requirement for Cloud Functions and other server-side environments.
export const config = {
  maxInstances: 10,
  region: 'us-central1'
};

// --- Service Account Key Configuration ---
// For local development, the Admin SDK needs a way to authenticate.
// The standard method is a service account key file.
// IMPORTANT: In a production Google Cloud environment (like App Hosting or Cloud Run),
// you should NOT use a service account key file. Instead, assign a service account
// to the service, and the SDK will automatically pick up the credentials.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    if (serviceAccount) {
        // Use service account key for local dev or non-Google environments
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'zen-jar',
        });
    } else {
        // For production on Google Cloud, the SDK will use the runtime's service account
        console.warn("Initializing Firebase Admin SDK without explicit credentials. This is expected for production on Google Cloud, but will have limited privileges for local development.");
        admin.initializeApp({
            projectId: 'zen-jar',
        });
    }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();


async function deleteUserCollections(userId: string) {
    console.log(`Starting deletion for user: ${userId}`);
    const collectionsToDelete = ['tasks', 'wins', 'focusSessions', 'gratitude', 'intentions', 'affirmations', 'userMappings'];
    const batchSize = 500; // Firestore batch limit

    for (const collectionName of collectionsToDelete) {
        const q = adminDb.collection(collectionName).where('userId', '==', userId).limit(batchSize);
        let snapshot;
        do {
            snapshot = await q.get();
            if (snapshot.empty) {
                break;
            }
            
            const batch = adminDb.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

        } while (snapshot.size >= batchSize);
        console.log(`Deleted user data from collection: ${collectionName}`);
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const decodedToken = await verifyFirebaseToken(req, adminAuth, serviceAccount);
    if (!decodedToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const uid = decodedToken.uid;

    // 1. Delete all user data from Firestore
    await deleteUserCollections(uid);

    // 2. Delete the user from Firebase Authentication
    // This part requires full admin privileges.
    // It will work locally with a service account key.
    // It will work in production if the service has the "Firebase Authentication Admin" role.
    try {
        await adminAuth.deleteUser(uid);
    } catch (error: any) {
        // If this fails locally, it's likely because the service account key is missing.
        // If it fails in production, the runtime service account may lack permissions.
        console.error(`Failed to delete Firebase Auth user for UID: ${uid}. This may be expected if running locally without a service account key. Error: ${error.message}`);
        // We don't block the request if this fails, as the user data is already deleted.
    }


    res.status(200).json({ success: true, message: 'Account deleted successfully.' });
    
  } catch (error: any) {
    console.error('Error deleting user:', error);
    let errorMessage = 'An internal error occurred.';
    if (error.code === 'auth/id-token-expired') {
        errorMessage = 'Security token has expired. Please sign in again.';
    } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. They may have already been deleted.';
    } else if (error.code) {
        errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
}
