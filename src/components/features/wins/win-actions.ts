
'use server';

import { collection, addDoc, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function addWin(userId: string, text: string) {
    if (!userId || !text.trim()) {
        throw new Error('User ID and win text are required.');
    }
    await addDoc(collection(db, 'wins'), {
        text,
        userId,
        createdAt: Timestamp.now(),
    });
}

export async function deleteWin(id: string) {
    if (!id) {
        throw new Error('Win ID is required.');
    }
    await deleteDoc(doc(db, 'wins', id));
}
