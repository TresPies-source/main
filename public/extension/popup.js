
const firebaseConfig = {
  projectId: "zen-jar",
  appId: "1:634724124220:web:ba7756c2eb459c12eda539",
  storageBucket: "zen-jar.firebasestorage.app",
  apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
  authDomain: "zen-jar.firebaseapp.com",
  messagingSenderId: "634724124220"
};

const API_BASE_URL = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net`;

// Mock data and functions for now
const quotes = [
  "The secret of getting ahead is getting started.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts."
];

let user = null;

// UI Elements
const loadingScreen = document.getElementById('loading-screen');
const loginScreen = document.getElementById('login-screen');
const mainApp = document.getElementById('main-app');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const getMotivationBtn = document.getElementById('get-motivation-btn');
const drawTaskBtn = document.getElementById('draw-task-btn');
const resultDisplay = document.getElementById('result-display');
const openAppLink = document.getElementById('open-app-link');


// --- Authentication ---
function updateUiForAuthState() {
    loadingScreen.style.display = 'block';
    loginScreen.style.display = 'none';
    mainApp.style.display = 'none';

    chrome.identity.getAuthToken({ interactive: false }, function(token) {
        if (chrome.runtime.lastError || !token) {
            console.log("Not signed in.");
            user = null;
            loadingScreen.style.display = 'none';
            loginScreen.style.display = 'block';
        } else {
            // Fetch user info to make sure the token is still valid
            fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
            .then(response => response.json())
            .then(userInfo => {
                if (userInfo.id) {
                    console.log("Signed in as:", userInfo.email);
                    user = {
                        email: userInfo.email,
                        name: userInfo.name,
                        id: userInfo.id,
                        token: token
                    };
                    welcomeMessage.textContent = `Hi, ${user.name.split(' ')[0]}!`;
                    loadingScreen.style.display = 'none';
                    mainApp.style.display = 'block';
                } else {
                     // Token is invalid, remove it
                    chrome.identity.removeCachedAuthToken({ token }, () => {
                         updateUiForAuthState(); // Retry
                    });
                }
            }).catch(e => {
                console.error("Error fetching user info", e);
                loadingScreen.style.display = 'none';
                loginScreen.style.display = 'block';
            });
        }
    });
}

loginBtn.addEventListener('click', () => {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }
        updateUiForAuthState();
    });
});

logoutBtn.addEventListener('click', () => {
    chrome.identity.getAuthToken({ interactive: false }, function(token) {
        if (token) {
            // Revoke the token
            fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
            // Remove the cached token
            chrome.identity.removeCachedAuthToken({ token: token }, () => {
                console.log("Logged out.");
                user = null;
                updateUiForAuthState();
            });
        }
    });
});


// --- Core Logic ---
function showResult(htmlContent, type = 'info') {
    resultDisplay.innerHTML = `<div class="result-card ${type}">${htmlContent}</div>`;
    setTimeout(() => {
        resultDisplay.innerHTML = '';
    }, 5000); // Clear after 5 seconds
}


getMotivationBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    showResult(`<blockquote>"${quote}"</blockquote>`, 'motivation');
});


drawTaskBtn.addEventListener('click', async () => {
    if (!user) {
        showResult('<p>Please sign in first.</p>', 'error');
        return;
    }
    drawTaskBtn.disabled = true;
    showResult('<p>Shuffling the jar...</p>', 'info');
    
    // In a real extension, this would be a Firestore call.
    // We will simulate it for now.
    // const pendingTasks = await getPendingTasksFromFirestore(user.id);
    const pendingTasks = [
        { id: '1', task: 'Write proposal', priority: 8 },
        { id: '2', task: 'Follow up with client', priority: 9 },
        { id: '3', task: 'Meditate for 5 minutes', priority: 4 },
    ];


    if (pendingTasks.length === 0) {
        showResult("<p>Your Task Jar is empty!</p>", 'info');
        drawTaskBtn.disabled = false;
        return;
    }

    const weightedList = pendingTasks.flatMap(task => Array(task.priority).fill(task));
    const randomIndex = Math.floor(Math.random() * weightedList.length);
    const selectedTask = weightedList[randomIndex];

    showResult(`<h3>Your Next Task:</h3><p>${selectedTask.task} (Priority: ${selectedTask.priority})</p>`, 'task');
    drawTaskBtn.disabled = false;
});


taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!taskInput.value.trim() || !user) {
        showResult('<p>Please enter a task and sign in.</p>', 'error');
        return;
    }

    const tasks = taskInput.value;
    taskInput.disabled = true;
    e.target.querySelector('button').disabled = true;
    e.target.querySelector('button').textContent = "Processing...";

    try {
        // This is where you would call your actual Genkit flow
        // For now, we simulate the call
        showResult(`<p>AI is categorizing and prioritizing your tasks...</p>`, 'info');
        
        // Simulating the result from `categorizeAndPrioritizeTasks` flow
        await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
        const result = tasks.split(',').map((t, i) => ({
            task: t.trim(),
            category: 'Personal',
            priority: Math.floor(Math.random() * 10) + 1
        }));
        
        console.log("Saving tasks to Firestore (simulated):", result);
        showResult(`<p>Successfully added ${result.length} tasks to your jar!</p>`, 'success');
        taskInput.value = '';

    } catch (error) {
        console.error("Error adding tasks:", error);
        showResult('<p>Could not add tasks. Please try again.</p>', 'error');
    } finally {
        taskInput.disabled = false;
        e.target.querySelector('button').disabled = false;
        e.target.querySelector('button').textContent = "Add Tasks with AI";
    }
});


openAppLink.addEventListener('click', (e) => {
    e.preventDefault();
    // This will need to be replaced with your actual app URL
    chrome.tabs.create({ url: 'https://zen-jar.web.app' }); 
});


// Initial Load
document.addEventListener('DOMContentLoaded', updateUiForAuthState);
