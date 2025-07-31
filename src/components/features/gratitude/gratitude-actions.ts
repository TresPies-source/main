
'use server';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { analyzeGratitudePatterns, AnalyzeGratitudePatternsInput } from '@/ai/flows/analyze-gratitude-patterns';

export async function addGratitudeEntry(userId: string, text: string, rating: number) {
    if (!userId || !text.trim()) {
        throw new Error('User ID and text are required.');
    }
    await addDoc(collection(db, 'gratitude'), {
        text,
        rating,
        userId,
        createdAt: Timestamp.now(),
    });
}

export async function callAnalyzeGratitudePatterns(input: AnalyzeGratitudePatternsInput) {
    return await analyzeGratitudePatterns(input);
}
