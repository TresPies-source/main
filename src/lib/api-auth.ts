// src/lib/api-auth.ts
import type { NextApiRequest } from 'next';
import type { Auth, DecodedIdToken } from 'firebase-admin/auth';

/**
 * Verifies the Firebase JWT token from the request headers.
 * @param req The Next.js API request object.
 * @param adminAuth The Firebase Admin Auth instance.
 * @param serviceAccount A flag indicating if the admin service account is available.
 * @returns The decoded token if valid, otherwise null.
 */
export async function verifyFirebaseToken(
    req: NextApiRequest,
    adminAuth: Auth,
    serviceAccount: any
): Promise<DecodedIdToken | null> {
    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
        console.error('No authorization token provided.');
        return null;
    }
    
    const idToken = authorization.split('Bearer ')[1];
    
    // In a local environment without a service account, we can't verify the token,
    // so we decode it for the UID but this is NOT secure for production.
    if (!serviceAccount) {
        console.warn("Skipping token verification in an environment without a service account.");
        return adminAuth.decodeJwt(idToken);
    }
    
    try {
        return await adminAuth.verifyIdToken(idToken);
    } catch (error: any) {
        console.error('Token verification failed:', error.message);
        return null;
    }
}
