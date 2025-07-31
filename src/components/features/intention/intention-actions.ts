
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateEncouragingResponse } from '@/ai/flows/generate-encouraging-response';

export async function setIntention(userId: string, intention: string, previousIntentions: string[]) {
    if (!userId || !intention.trim()) {
        throw new Error('User ID and intention are required.');
    }

    const result = await generateEncouragingResponse({
        intention,
        previousIntentions,
    });
    
    await addDoc(collection(db, 'intentions'), {
        userId,
        intention,
        aiResponse: result.response,
        createdAt: Timestamp.now(),
    });

    return result;
}
