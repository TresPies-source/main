// src/pages/api/delete-user.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

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
    const collectionsToDelete = ['tasks', 'wins', 'focusSessions', 'gratitude', 'intentions', 'affirmations', 'userMappings'];
    const batch = adminDb.batch();

    for (const collectionName of collectionsToDelete) {
        const q = adminDb.collection(collectionName).where('userId', '==', userId);
        const snapshot = await q.get();
        if (!snapshot.empty) {
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
        }
    }

    await batch.commit();
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Gracefully handle missing service account key
  if (!serviceAccount) {
    console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Cannot perform admin operations.");
    return res.status(500).json({ error: 'Server is not configured for user deletion. Please contact support.' });
  }

  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 1. Delete all user data from Firestore
    await deleteUserCollections(uid);

    // 2. Delete the user from Firebase Authentication
    await adminAuth.deleteUser(uid);

    res.status(200).json({ success: true, message: 'Account deleted successfully.' });
    
  } catch (error: any) {
    console.error('Error deleting user:', error);
    let errorMessage = 'An internal error occurred.';
    if (error.code === 'auth/id-token-expired') {
        errorMessage = 'Security token has expired. Please sign in again.';
    } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. They may have already been deleted.';
    }
    res.status(500).json({ error: errorMessage });
  }
}
