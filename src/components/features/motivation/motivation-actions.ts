
'use server';

import { collection, addDoc, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function addCustomAffirmation(userId: string, text: string) {
    if (!userId || !text.trim()) {
        throw new Error('User ID and affirmation text are required.');
    }
    await addDoc(collection(db, 'affirmations'), {
        text,
        userId,
        createdAt: Timestamp.now(),
    });
}

export async function deleteCustomAffirmation(id: string) {
    if (!id) {
        throw new Error('Affirmation ID is required.');
    }
    await deleteDoc(doc(db, 'affirmations', id));
}
