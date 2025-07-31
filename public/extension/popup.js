
import { auth, db, onAuthStateChanged, collection, query, where, getDocs } from './firebase-config.js';

const defaultQuotes = [
  "You don’t always get what you wish for; you get what you work for.",
  "Believe you can, and you’re already halfway there.",
  "Progress, not perfection.",
  "A small step today leads to a big leap tomorrow.",
  "Done is better than perfect.",
  "Motivation follows action—just begin.",
];

document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('draw-motivation');
    const quoteDisplay = document.getElementById('quote-display');

    const drawQuote = async (user) => {
        quoteDisplay.innerHTML = `<span class="loading">Loading...</span>`;
        let allQuotes = [...defaultQuotes];

        if (user) {
            try {
                const q = query(collection(db, 'affirmations'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const customAffirmations = querySnapshot.docs.map(doc => doc.data().text);
                allQuotes = [...allQuotes, ...customAffirmations];
            } catch (error) {
                console.error("Error fetching custom affirmations:", error);
            }
        }
        
        if (allQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * allQuotes.length);
            quoteDisplay.textContent = `"${allQuotes[randomIndex]}"`;
        } else {
            quoteDisplay.textContent = "No affirmations found.";
        }
    };
    
    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            drawQuote(user);
            drawButton.onclick = () => drawQuote(user);
        } else {
            drawQuote(null);
            drawButton.onclick = () => drawQuote(null);
        }
    });
});
