const firebaseConfig = {
  projectId: "zen-jar",
  appId: "1:634724124220:web:ba7756c2eb459c12eda539",
  storageBucket: "zen-jar.firebasestorage.app",
  apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
  authDomain: "zen-jar.firebaseapp.com",
  messagingSenderId: "634724124220"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const CATEGORIZE_FLOW_URL = 'https://us-central1-zen-jar.cloudfunctions.net/categorizeAndPrioritizeTasksFlow';

const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const googleSignInButton = document.getElementById('google-signin');
const logoutButton = document.getElementById('logout-button');
const userGreeting = document.getElementById('user-greeting');
const addTaskButton = document.getElementById('add-tasks-button');
const taskInput = document.getElementById('task-input');
const getMotivationButton = document.getElementById('get-motivation-button');
const drawTaskButton = document.getElementById('draw-task-button');
const displayArea = document.getElementById('display-area');

const quotes = [
  "The secret of getting ahead is getting started.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you’ve ever wanted is on the other side of fear.",
  "The journey of a thousand miles begins with a single step.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "The future belongs to those who believe in the beauty of their dreams."
];

function showView(view) {
  loginView.style.display = 'none';
  mainView.style.display = 'none';
  view.style.display = 'block';
}

function updateUI(user) {
  if (user) {
    showView(mainView);
    userGreeting.textContent = `Hello, ${user.displayName.split(' ')[0]}!`;
  } else {
    showView(loginView);
  }
}

auth.onAuthStateChanged(updateUI);

googleSignInButton.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(error => {
    console.error('Sign in error', error);
  });
});

logoutButton.addEventListener('click', () => {
  auth.signOut();
});

addTaskButton.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user || !taskInput.value.trim()) return;

    addTaskButton.textContent = 'Processing...';
    addTaskButton.disabled = true;

    try {
        const token = await user.getIdToken();
        const response = await fetch(CATEGORIZE_FLOW_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ data: { tasks: taskInput.value } }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json();
        const tasks = result.result;
        
        const batch = db.batch();
        tasks.forEach(task => {
            const docRef = db.collection('tasks').doc();
            batch.set(docRef, { 
                ...task, 
                userId: user.uid, 
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                completed: false
            });
        });

        await batch.commit();
        taskInput.value = '';
        displayResult(`Added ${tasks.length} task(s) to your jar!`);
        
    } catch (error) {
        console.error('Error processing tasks:', error);
        displayResult('Failed to add tasks.', true);
    } finally {
        addTaskButton.textContent = 'Add Tasks with AI';
        addTaskButton.disabled = false;
    }
});


getMotivationButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    displayResult(`"${quote}"`);
});

drawTaskButton.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    drawTaskButton.disabled = true;
    try {
        const tasksSnapshot = await db.collection('tasks')
            .where('userId', '==', user.uid)
            .where('completed', '==', false)
            .get();
        
        const pendingTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (pendingTasks.length === 0) {
            displayResult("You have no pending tasks to draw!");
            return;
        }

        const weightedList = pendingTasks.flatMap(task => Array(task.priority || 1).fill(task));
        const randomIndex = Math.floor(Math.random() * weightedList.length);
        const selectedTask = weightedList[randomIndex];
        
        displayResult(`Your next task: ${selectedTask.task}`);

    } catch (error) {
        console.error("Error drawing task:", error);
        displayResult("Could not draw a task. Please try again.", true);
    } finally {
        drawTaskButton.disabled = false;
    }
});

function displayResult(message, isError = false) {
    displayArea.textContent = message;
    displayArea.className = isError ? 'display-area error' : 'display-area success';
    displayArea.style.display = 'block';

    setTimeout(() => {
        displayArea.style.display = 'none';
        displayArea.textContent = '';
    }, 5000);
}
