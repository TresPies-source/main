// This is a placeholder for the extension's popup logic.
// We will add Firebase initialization, authentication, and task management here.
console.log("ZenJar extension popup loaded.");

const firebaseConfig = {
  projectId: "zen-jar",
  appId: "1:634724124220:web:ba7756c2eb459c12eda539",
  storageBucket: "zen-jar.firebasestorage.app",
  apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
  authDomain: "zen-jar.firebaseapp.com",
  messagingSenderId: "634724124220"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- DOM Elements ---
const loadingScreen = document.getElementById('loading-screen');
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const userGreeting = document.getElementById('user-greeting');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

let currentUser = null;
let idToken = null;

// --- Authentication ---
auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    user.getIdToken(true).then(token => {
      idToken = token;
      userGreeting.textContent = `Hello, ${user.displayName.split(' ')[0]}!`;
      showScreen('main');
    }).catch(error => {
      console.error("Error getting ID token:", error);
      showScreen('login');
    });
  } else {
    showScreen('login');
  }
});

loginButton.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .catch(error => {
      console.error("Login failed:", error);
    });
});

logoutButton.addEventListener('click', () => {
  auth.signOut();
});


// --- Task Management ---
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const tasks = taskInput.value.trim();
  if (!tasks || !currentUser || !idToken) return;

  const button = document.getElementById('add-task-button');
  button.disabled = true;
  button.textContent = 'Processing...';

  try {
    // This function will call your Genkit flow.
    // NOTE: For this to work, you must deploy your flows.
    // We are calling the deployed function URL.
    // Replace with your actual Cloud Function URL.
    const functionUrl = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/categorizeAndPrioritizeTasksFlow`;
    
    const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ data: { tasks: tasks } })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'AI flow failed');
    }

    const result = await response.json();
    const categorizedTasks = result.result; // The actual data is in the 'result' field
    
    // Save to Firestore
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
    alert(`${categorizedTasks.length} task(s) added successfully!`);

  } catch (error) {
    console.error('Error processing tasks:', error);
    alert(`Error: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = 'Process with AI';
  }
});


// --- UI Management ---
function showScreen(screenName) {
  loadingScreen.style.display = 'none';
  loginScreen.style.display = 'none';
  mainApp.style.display = 'none';

  if (screenName === 'login') {
    loginScreen.style.display = 'flex';
  } else if (screenName === 'main') {
    mainApp.style.display = 'block';
  } else {
    loadingScreen.style.display = 'block';
  }
}
