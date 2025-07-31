// src/pages/api/delete-user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import { verifyFirebaseToken } from '@/lib/api-auth';

// This is a requirement for Cloud Functions and other server-side environments.
export const config = {
  maxInstances: 10,
  region: 'us-central1'
};

// Initialize Firebase Admin SDK
// This should be set as an environment variable in your hosting environment.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!admin.apps.length) {
    if (serviceAccount) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'zen-jar',
        });
    } else {
        // Initialize for local development or environments without service account JSON
        // Note: This will have limited privileges.
        console.warn("Firebase Admin SDK initialized without credentials. For production, set FIREBASE_SERVICE_ACCOUNT_KEY.");
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

  // Gracefully handle missing service account key for production environments
  if (!serviceAccount && process.env.NODE_ENV === 'production') {
    console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Cannot perform admin operations in production.");
    return res.status(500).json({ error: 'Server is not configured for user deletion. Please contact support.' });
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
    // This part requires full admin privileges, only works if service account is set.
    if(serviceAccount) {
        await adminAuth.deleteUser(uid);
    } else {
        console.warn(`Firestore data for user ${uid} deleted, but Auth user was not deleted due to missing service account key.`);
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
