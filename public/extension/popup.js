// --- Firebase Initialization ---
// This assumes you have firebase-app.js, firebase-auth.js, and firebase-firestore.js included
const firebaseConfig = {
  projectId: "zen-jar",
  appId: "1:634724124220:web:ba7756c2eb459c12eda539",
  storageBucket: "zen-jar.firebasestorage.app",
  apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
  authDomain: "zen-jar.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "634724124220"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- DOM Elements ---
const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const loadingView = document.getElementById('loading-view');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const motivationBtn = document.getElementById('motivation-btn');
const drawTaskBtn = document.getElementById('draw-task-btn');
const displayArea = document.getElementById('display-area');
const addTaskBtn = document.getElementById('add-task-btn');

// --- Motivational Quotes ---
const quotes = [
  "The secret of getting ahead is getting started.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

// --- App Logic ---
const showView = (view) => {
    loginView.style.display = 'none';
    mainView.style.display = 'none';
    loadingView.style.display = 'none';
    view.style.display = 'block';
};

// --- Authentication ---
auth.onAuthStateChanged(user => {
    if (user) {
        showView(mainView);
    } else {
        showView(loginView);
    }
});

loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(error => {
        console.error("Login failed:", error);
    });
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// --- Task Management ---
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !taskInput.value.trim()) return;

    addTaskBtn.disabled = true;
    addTaskBtn.textContent = 'Processing...';

    // This is a simplified fetch to a potential Genkit endpoint.
    // In a real scenario, you'd deploy your Genkit flows as HTTP endpoints.
    // For this example, we'll simulate the categorization locally
    // and then add to Firestore. It does NOT call the real AI flow.
    const tasks = taskInput.value.trim().split(/,
|\n/).filter(Boolean);
    const batch = db.batch();

    tasks.forEach(taskText => {
        const docRef = db.collection('tasks').doc();
        batch.set(docRef, {
            task: taskText,
            category: 'Personal', // Default category for extension
            priority: 5, // Default priority
            userId: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            completed: false
        });
    });

    try {
        await batch.commit();
        taskInput.value = '';
        displayArea.innerHTML = `<p class="success">Added ${tasks.length} task(s)!</p>`;
    } catch (error) {
        console.error("Error adding tasks:", error);
        displayArea.innerHTML = `<p class="error">Failed to add tasks.</p>`;
    } finally {
        addTaskBtn.disabled = false;
        addTaskBtn.textContent = 'Add Tasks with AI';
    }
});


// --- Quick Actions ---
motivationBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    displayArea.innerHTML = `<p class="quote">"${quote}"</p>`;
});

drawTaskBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;

    displayArea.innerHTML = '<p>Drawing a task...</p>';

    try {
        const tasksRef = db.collection('tasks');
        const q = tasksRef.where('userId', '==', user.uid).where('completed', '==', false);
        const snapshot = await q.get();

        if (snapshot.empty) {
            displayArea.innerHTML = '<p>No pending tasks to draw!</p>';
            return;
        }

        const pendingTasks = snapshot.docs.map(doc => doc.data());
        const weightedList = pendingTasks.flatMap(task => Array(task.priority).fill(task));
        const randomIndex = Math.floor(Math.random() * weightedList.length);
        const selectedTask = weightedList[randomIndex];
        
        displayArea.innerHTML = `
            <div class="drawn-task">
                <p>Your next task is:</p>
                <strong>${selectedTask.task}</strong>
            </div>
        `;

    } catch (error) {
        console.error("Error drawing task:", error);
        displayArea.innerHTML = '<p class="error">Could not draw a task.</p>';
    }
});

// --- Initial View ---
showView(loadingView);
