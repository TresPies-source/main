# ZenJar

ZenJar is a minimalist, multi-platform wellness and productivity tool that uses AI-powered "jars" to help users organize tasks, find motivation, practice gratitude, and build confidence through a unique "count-up" approach to focus and accomplishments.

In a world of overwhelming to-do lists and constant distractions, ZenJar was conceived to combat digital fatigue and foster mindfulness. It embraces a "count-up" philosophy, turning focus and achievements into tangible, growing assets.

This version is the ungated, free with google sign in, stable 2d web app open beta, proprietary property of TresPies Design. 

## Core Features

- **AI-Powered Task Jar**: "Brain dump" your unstructured tasks, and let the AI automatically categorize and prioritize them for you.
- **Motivation & Gratitude Jars**: Draw from a pre-filled jar of affirmations for a quick boost, and record things you're grateful for in a persistent journal.
- **Growth Ecosystem**: Track your focus sessions with a unique "count-up" timer and log your accomplishments in the "Win Jar."
- **AI Intention Setter**: State your daily goal and receive a supportive, encouraging response from an AI that learns from your past intentions.
- **Cross-Platform**: Access ZenJar through the core web app, a Google Chrome Extension, or via Slack and Discord bots.
- **Voice Control (ZenSpeak)**: Use your voice to add tasks, get motivation, and set intentions for a hands-free experience.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (with App Router), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Hosting**: [Firebase](https://firebase.google.com/) (App Hosting, Authentication, Firestore, Cloud Functions)
- **AI**: [Google Genkit](https://firebase.google.com/docs/genkit) with Gemini models

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### 1. Installation

Clone the repository and install the necessary dependencies:

```bash
git clone <your-repo-url>
cd <your-repo-name>
npm install
```

### 2. Firebase Setup

This project is tightly integrated with Firebase.

1.  **Log in to Firebase**:
    ```bash
    firebase login
    ```
2.  **Initialize Firebase**: If you haven't already, link your local directory to your Firebase project.
    ```bash
    firebase init
    ```
    - Choose **App Hosting**.
    - Select an existing Firebase project (`zen-jar`).

### 3. Running the Development Server

To run the Next.js development server for the frontend, use:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

To run the Genkit flows for local AI development, use a separate terminal:

```bash
npm run genkit:watch
```

This starts the Genkit developer UI, allowing you to inspect and test your AI flows.

### 4. Setting up Environment Variables (Optional)

Some features, like the `delete-user` API route, require Firebase Admin privileges. For local development of these features, you will need a service account key.

1.  Go to your Firebase Console -> Project Settings -> Service accounts.
2.  Generate a new private key and download the JSON file.
3.  Create a `.env.local` file in the root of your project.
4.  Add the following line, pasting the entire content of the JSON file as a single line string:
    ```
    FIREBASE_SERVICE_ACCOUNT_KEY='<paste-your-json-file-contents-here>'
    ```

**Note**: The `.env.local` file is listed in `.gitignore` and should never be committed to your repository.

## Deployment

This application is configured for deployment with [Firebase App Hosting](https://firebase.google.com/docs/app-hosting). To deploy your application, make sure you have set any necessary secrets (see `internal/secrets.md` for guidance) and then run:

```bash
firebase apphosting:backends:deploy
```
