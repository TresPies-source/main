// --- Firebase Configuration ---
const firebaseConfig = {
    projectId: "zen-jar",
    appId: "1:634724124220:web:ba7756c2eb459c12eda539",
    storageBucket: "zen-jar.firebasestorage.app",
    apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
    authDomain: "zen-jar.firebaseapp.com",
    messagingSenderId: "634724124220"
};

// --- Cloud Function URL ---
// This needs to be the URL of your deployed 'categorizeAndPrioritizeTasks' function
const CATEGORIZE_TASKS_URL = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/categorizeAndPrioritizeTasksFlow`;


// --- Initialize Firebase ---
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- DOM Elements ---
const loadingView = document.getElementById('loading-view');
const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userNameEl = document.getElementById('user-name');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');


// --- Authentication Logic ---
let currentUser = null;

auth.onAuthStateChanged(user => {
    loadingView.style.display = 'none';
    if (user) {
        currentUser = user;
        userNameEl.textContent = user.displayName.split(' ')[0]; // Show first name
        mainView.style.display = 'block';
        loginView.style.display = 'none';
    } else {
        currentUser = null;
        mainView.style.display = 'none';
        loginView.style.display = 'block';
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

// --- Task Logic ---
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tasksText = taskInput.value.trim();
    if (!tasksText || !currentUser) return;

    addTaskBtn.textContent = 'Processing...';
    addTaskBtn.disabled = true;

    try {
        // We need to get a Firebase ID token to authenticate with the Genkit flow
        const idToken = await currentUser.getIdToken();

        // Call the Genkit flow via its invoker URL
        const response = await fetch(CATEGORIZE_TASKS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ tasks: tasksText })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'AI processing failed');
        }

        const categorizedTasks = await response.json();

        // Save tasks to Firestore
        const batch = db.batch();
        categorizedTasks.forEach(task => {
            const docRef = db.collection('tasks').doc();
            batch.set(docRef, {
                ...task,
                userId: currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                completed: false
            });
        });

        await batch.commit();

        taskInput.value = '';
        console.log("Tasks added successfully!");

    } catch (error) {
        console.error("Error adding tasks:", error);
        alert(`Error: ${error.message}`);
    }

    addTaskBtn.textContent = 'Process with AI';
    addTaskBtn.disabled = false;
});
