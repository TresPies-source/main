// Hardcoded Firebase and Genkit configs from your project
const firebaseConfig = {
    apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
    authDomain: "zen-jar.firebaseapp.com",
    projectId: "zen-jar",
};

const GENKIT_API_URL = 'https://us-central1-zen-jar.cloudfunctions.net';
const FLOW_API_KEY = "mock-api-key"; // Replace with your actual Genkit flow API key if you set one

// DOM Elements
const loadingView = document.getElementById('loading-view');
const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const motivationBtn = document.getElementById('motivation-btn');
const drawTaskBtn = document.getElementById('draw-task-btn');
const displayArea = document.getElementById('display-area');
const openAppLink = document.getElementById('open-app-link');


// State
let user = null;
let accessToken = null;

const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts."
];


// --- Core Functions ---

function showView(view) {
    loadingView.style.display = 'none';
    loginView.style.display = 'none';
    mainView.style.display = 'none';
    view.style.display = 'block';
}

async function callGenkitFlow(flowName, data) {
    addTaskBtn.disabled = true;
    addTaskBtn.textContent = 'Processing...';
    try {
        // In a real extension, you would get an auth token for your user
        // and pass it in the Authorization header.
        const response = await fetch(`${GENKIT_API_URL}/${flowName}?key=${FLOW_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Flow ${flowName} failed`);
        }
        const result = await response.json();
        return result.output;
    } finally {
        addTaskBtn.disabled = false;
        addTaskBtn.textContent = 'Process with AI';
    }
}

// --- Authentication ---

async function handleLogin() {
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
        if (chrome.runtime.lastError || !token) {
            console.error(chrome.runtime.lastError);
            displayArea.textContent = 'Login failed. Could not get auth token.';
            return;
        }
        accessToken = token;
        
        // Use the token to get user profile info
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const profile = await response.json();

        user = {
            displayName: profile.name,
            email: profile.email,
            uid: profile.id, // Using Google's ID as a stable user ID
        };
        chrome.storage.local.set({ user, accessToken });
        updateUI();
    });
}

async function handleLogout() {
    if (accessToken) {
        // Revoke the token
        await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`);
        chrome.identity.removeCachedAuthToken({ token: accessToken });
    }
    user = null;
    accessToken = null;
    chrome.storage.local.remove(['user', 'accessToken']);
    updateUI();
}

function updateUI() {
    if (user) {
        welcomeMessage.textContent = `Hi, ${user.displayName.split(' ')[0]}!`;
        showView(mainView);
    } else {
        showView(loginView);
    }
}


// --- Feature Logic ---

async function handleAddTask() {
    const tasksText = taskInput.value.trim();
    if (!tasksText) {
        displayArea.textContent = 'Please enter at least one task.';
        return;
    }

    try {
        const processedTasks = await callGenkitFlow('categorizeAndPrioritizeTasksFlow', { tasks: tasksText });
        // In a real app, you would now save these tasks to Firestore.
        // For this example, we'll just show a success message.
        taskInput.value = '';
        displayArea.textContent = `${processedTasks.length} task(s) processed and ready to be saved!`;
        console.log("Processed tasks:", processedTasks);
    } catch (e) {
        console.error("Error processing tasks:", e);
        displayArea.textContent = `Error: ${e.message}`;
    }
}

function handleGetMotivation() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    displayArea.textContent = `"${motivationalQuotes[randomIndex]}"`;
}

async function handleDrawTask() {
    // This is a simplified version. A real implementation would query Firestore.
    displayArea.textContent = "Querying your Task Jar... (simulated)";
    setTimeout(() => {
        // Simulate drawing a task
        const simulatedTasks = [
            { task: "Review project proposal", priority: 8 },
            { task: "Call mom", priority: 5 },
            { task: "Buy groceries", priority: 7 },
        ];
        const weightedList = simulatedTasks.flatMap(task => Array(task.priority).fill(task));
        const randomIndex = Math.floor(Math.random() * weightedList.length);
        const selectedTask = weightedList[randomIndex];
        
        displayArea.textContent = `Your next task is: ${selectedTask.task}`;
    }, 1500);
}


// --- Event Listeners ---

loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
addTaskBtn.addEventListener('click', handleAddTask);
motivationBtn.addEventListener('click', handleGetMotivation);
drawTaskBtn.addEventListener('click', handleDrawTask);
openAppLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'http://localhost:3000' }); // Replace with your deployed app URL
});

// --- Initialization ---

// Check if user is already logged in from a previous session
chrome.storage.local.get(['user', 'accessToken'], (result) => {
    if (result.user && result.accessToken) {
        user = result.user;
        accessToken = result.accessToken;
    }
    updateUI();
});
