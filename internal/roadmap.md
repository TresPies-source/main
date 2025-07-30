# ZenJar Project Roadmap
This roadmap breaks down the ZenJar development into distinct phases, outlining the features to be implemented and the associated coding requirements for each stage.

## Phase 1: Foundation & Core Setup (Est. 1-2 Weeks)
**Objective:** Establish the basic application structure, user authentication, and core UI shell.

**Features:**

- Project Initialization (Next.js, Firebase)
- User Authentication (Google Sign-In)
- Basic UI Layout & Navigation
- Firebase Integration Setup
- Initial Settings Page UI (placeholder for public site link)

**Coding Requirements:**

- **Next.js Project Setup:** `npx create-next-app` with TypeScript.
- **Tailwind CSS Configuration:** Integrate Tailwind CSS for styling.
- **Firebase Project Initialization:** `firebase init` (Hosting, Firestore, Functions, Auth).
- **Firebase SDK Integration:**
  - `initializeApp` with `__firebase_config`.
  - `getAuth`, `getFirestore`.
  - `signInWithCustomToken(__initial_auth_token)` or `signInAnonymously`.
  - `onAuthStateChanged` listener to manage user state and `userId`.
- **Authentication UI:**
  - Login/Logout components.
  - Google Sign-In button (`signInWithPopup` for Google provider).
- **Layout Components:**
  - Main App component.
  - Navigation bar (e.g., links to Task Jar, Motivation Jar, Gratitude Jar, Intention Setter).
  - Basic container components for content.
- **Global State Management:** Context API or Zustand for user authentication status and `userId`.
- **Settings Page:** Basic page structure with a placeholder for the "About ZenJar & Our Roadmap" button.

## Phase 2: Task Jar & Initial AI Integration (Est. 2-3 Weeks)
**Objective:** Implement the core Task Jar functionality, including AI processing and weighted selection.

**Features:**

- "Brain Dump" Input UI
- AI-Powered Task Categorization & Prioritization
- Task Display & Filtering
- Weighted Random Task Selection
- Task Persistence (Firestore)
- "Empty Jar" Functionality

**Coding Requirements:**

- **Task Input Component:** Text area for brain dump, submit button.
- **Firebase Cloud Function (Genkit):**
  - Define a Genkit flow that takes raw text.
  - Uses `gemini-2.5-flash-preview-05-20` to parse text into an array of task objects (content, priority, category).
  - Returns structured JSON.
- **Frontend-Cloud Function Integration:**
  - `fetch` call to the Cloud Function endpoint from the Next.js app.
  - Loading states and error handling for AI processing.
- **Firestore Schema for Tasks:**
  - `/artifacts/{appId}/users/{userId}/tasks` collection.
  - Each document: `content`, `category`, `priority`, `status` (e.g., 'pending', 'completed'), `createdAt`.
- **Task List Display:**
  - Render tasks with their category colors and priority.
  - Implement `onSnapshot` listener for real-time updates.
  - Filtering/sorting options (e.g., by category, priority) client-side.
- **Weighted Random Selection Logic:**
  - JavaScript function to select a task based on its priority (e.g., higher priority tasks appear multiple times in a temporary array for selection).
  - UI for "Pick a Task" button and displaying the picked task.
- **"Empty Jar" Logic:** Firestore batch delete or individual document deletions.

## Phase 3: Motivation, Gratitude & Intention Setter (Est. 2-3 Weeks)
**Objective:** Implement the remaining core "jar" features and the AI-powered intention setter.

**Features:**

- Motivation Jar (Random Affirmations)
- Gratitude Jar (Entry, Rating, Persistence, Basic Visualization)
- AI-Powered Intention Setter

**Coding Requirements:**

- **Motivation Jar UI:**
  - "Draw Affirmation" button.
  - Display area for the affirmation.
  - Static array of affirmations in client-side code (initially).
- **Gratitude Jar UI:**
  - Input field for gratitude entry.
  - Rating input (1-5, e.g., radio buttons or a slider).
  - "Add to Jar" button.
- **Firestore Schema for Gratitude:**
  - `/artifacts/{appId}/users/{userId}/gratitude` collection.
  - Each document: `content`, `rating`, `createdAt`.
- **Gratitude List Display:**
  - Render gratitude entries.
  - Implement `onSnapshot` listener.
  - Basic visual weighting (e.g., larger font size or distinct styling for higher-rated items).
- **Intention Setter UI:**
  - Text input for user intention.
  - "Set Intention" button.
  - Display area for AI response.
- **Firebase Cloud Function (Genkit) for Intention Setter:**
  - Define a Genkit flow that takes user intention.
  - Uses `gemini-2.5-flash-preview-05-20` to generate a supportive response.
- **Firestore Schema for Intentions:**
  - `/artifacts/{appId}/users/{userId}/intentions` collection.
  - Each document: `userText`, `aiResponse`, `createdAt`.

## Phase 4: Growth Ecosystem & Monetization (Est. 3-4 Weeks)
**Objective:** Integrate the "count-up" focus timer, "Win" Jar, streak tracking, and implement the freemium model with payment processing.

**Features:**

- Focus Timer (Count-Up)
- "Win" Jar (Logging Accomplishments)
- Streaks & Personal Records Tracking
- Basic Free Tier Limits Enforcement
- ZenJar Pro Subscription Management
- Upgrade UI & Payment Gateway Integration

**Coding Requirements:**

- **Focus Timer Component:**
  - Start/Stop buttons.
  - Display for elapsed time (MM:SS).
  - JavaScript `setInterval` for counting up.
  - State management for timer status (running/stopped), elapsed time.
- **"Win" Jar UI:**
  - Input field for win description.
  - "Log Win" button.
  - Display list of wins.
- **Firestore Schema for Focus Sessions & Wins:**
  - `/artifacts/{appId}/users/{userId}/focusSessions` collection: `duration` (seconds), `taskId` (optional), `createdAt`.
  - `/artifacts/{appId}/users/{userId}/wins` collection: `content`, `focusSessionId` (optional), `createdAt`.
- **Streak Tracking Logic:**
  - Client-side or Cloud Function logic to calculate daily focus/win streaks based on Firestore data.
  - Display current streaks and personal bests on the dashboard.
- **Free Tier Limit Enforcement:**
  - Implement checks before adding new tasks/wins/gratitude entries if the user is on the free tier.
  - Display appropriate "Upgrade to Pro" messages.
- **Payment Gateway Integration (Stripe/RevenueCat):**
  - Client-side code for subscription checkout flow.
  - Firebase Cloud Functions for webhook handling (processing successful payments, subscription status changes).
  - Update user's Firestore document to reflect Pro status.
- **Pro Feature Placeholders:**
  - UI elements for "Growth Dashboard," "Unlimited Features," etc., that are disabled or lead to an upgrade prompt.

## Phase 5: Cross-Platform Integration & Polish (Est. 3-4 Weeks)
**Objective:** Extend ZenJar to other platforms and refine the user experience.

**Features:**

- Google Chrome Extension
- Slack Bot Integration
- Discord Bot Integration
- UI/UX Refinements
- Error Handling & Robustness
- Deployment Pipeline Finalization

**Coding Requirements:**

- **Google Chrome Extension:**
  - `manifest.json` configuration.
  - Popup HTML/CSS/JS (React components can be adapted).
  - Direct Firebase SDK calls from the extension for quick add/draw.
- **Slack Bot:**
  - Set up Slack App with necessary permissions (commands, events).
  - **Firebase Cloud Functions (HTTP Trigger):**
    - Endpoint to receive Slack slash commands.
    - Parse command, call relevant ZenJar logic (e.g., add task, pick task).
    - Respond to Slack with formatted messages.
- **Discord Bot:**
  - Set up Discord Bot with necessary permissions.
  - **Firebase Cloud Functions (HTTP Trigger):**
    - Endpoint to receive Discord interactions.
    - Parse command, call relevant ZenJar logic.
    - Respond to Discord.
- **Comprehensive Error Handling:** `try/catch` blocks for all API calls and Firestore operations. User-friendly error messages.
- **Responsive Design Review:** Ensure all UI components are fully responsive across breakpoints using Tailwind's utility classes.
- **Performance Optimization:** Lazy loading, image optimization (if any), minimizing re-renders.
- **Firebase Hosting Deployment:** Finalize `firebase.json` for deployment.

## Phase 6: Public Presence & Core Integrations (Est. 4-5 Weeks)
**Objective:** Establish ZenJar's public-facing website and implement initial Google Suite integrations.

**Features:**

- Settings Page Link: Implement the button/link in the user's settings page to the public site.
- About Us Section: Dedicated public page detailing ZenJar's mission, philosophy, and unique aspects.
- Public Development Roadmap: A simplified, high-level roadmap for external viewing.
- Blog: Initial blog setup with content management capabilities.
- Google Calendar Integration: Turn picked tasks into calendar events.
- Google Tasks Synchronization: Bi-directional sync with Google Tasks lists.
- Google Keep/Docs Integration: Import text for brain dump processing.
- Google Drive Export: Export jar contents to Google Drive.

**Coding Requirements:**

- **Settings Page UI:** Implement the actual navigation button/link.
- **Next.js Pages for Public Site:**
  - `/public/about` (static content).
  - `/public/roadmap` (static content, potentially with collapsible sections).
  - `/public/blog` and `/public/blog/[slug]` (integrate with headless CMS or Markdown parser).
- **Google API Integrations (OAuth 2.0):**
  - Client-side OAuth flow initiation.
  - Firebase Cloud Functions to handle token exchange and API calls for Google Calendar, Tasks, Keep/Docs, and Drive.
  - UI elements for connecting/disconnecting Google services.
  - Logic for creating calendar events, syncing tasks, fetching document content, and generating/uploading export files.

## Phase 7: Advanced Integrations & Future Enhancements (Ongoing)
**Objective:** Continuous improvement, expansion of integrations, and preparation for advanced AI agent collaboration.

**Features:**

- Pro Tier Features: Full implementation of Growth Dashboard, advanced streak tracking, custom jars, custom affirmations.
- Enhanced Gratitude Visualization: Dynamic, interactive visualizations (e.g., growing tree, constellation).
- Guided Intention Setting: Multi-step prompts and daily reflection.
- Shared Jars (Collaboration): Allow users to create and share specific jars with others.
- Other Productivity Tool Integrations: (e.g., Todoist, Notion, Asana) bi-directional sync.
- User Feedback System: In-app feedback forms.
- Analytics: Deeper integration for usage patterns.
- AI Agent Integration Readiness: Refined API endpoints for external AI agents.

**Coding Requirements:**

- **Pro Feature Development:** Implement the full functionality for all Pro tier features.
- **Third-Party API Integrations:** Research and implement APIs for Todoist, Notion, Asana, etc. (OAuth/API key management, Cloud Functions for data flow).
- **Modular API Design:** Ensure Firebase Cloud Functions are well-structured and documented for a potential external AI consumption.
- **Secure Agent Authentication:** Plan for secure authentication mechanisms for external AI agents (e.g., dedicated API keys, scoped OAuth tokens).
- **Data Model Consistency:** Maintain clear and consistent Firestore data models to facilitate external parsing by AI agents.

# ZenJar Project Management Summary (Updated)

## Project Overview
- **Project Name:** ZenJar
- **Objective:** To develop a minimalist, multi-platform wellness and productivity tool that leverages AI to help users organize tasks, find motivation, practice gratitude, and build confidence through a unique "count-up" approach to focus and accomplishments. The project also aims to establish a public-facing web presence and enable comprehensive integration with Google Suite and other third-party productivity tools, preparing for future AI agent collaboration.
- **Key Deliverables (MVP):** Functional AI-powered Task Jar, Motivation Jar, Gratitude Jar, AI-powered Intention Setter, "Count-Up" Focus Timer, "Win" Jar, basic streak tracking, cross-platform accessibility (Web App, Google Extension, Slack, Discord), a public "About Us" section, public roadmap, blog, and initial Google Calendar/Tasks/Keep/Drive integrations.
- **Target Audience:** Individuals seeking to combat digital overwhelm, improve focus, practice mindfulness, and build self-efficacy, as well as those looking for seamless integration with their existing digital workflows.

## Methodology
The project will follow an Agile (Scrum-like) methodology, emphasizing iterative development, continuous feedback, and adaptability.

- **Sprints:** Development will be organized into 1-2 week sprints, with defined goals for each.
- **Daily Stand-ups:** Brief daily check-ins to discuss progress, roadblocks, and next steps.
- **Sprint Reviews:** Demonstrations of completed features at the end of each sprint.
- **Retrospectives:** Regular meetings to reflect on the process and identify areas for improvement.

## Key Success Metrics
- **Feature Completion:** Successful implementation of all core MVP features, public site sections, and initial integrations.
- **User Engagement:** Number of active users, frequency of jar interactions (task picks, gratitude entries, focus sessions), and adoption of integrated features.
- **Public Site Traffic:** Engagement with the About Us, Roadmap, and Blog sections.
- **Integration Adoption:** Percentage of users connecting ZenJar with Google Suite and other services.
- **Performance:** Application responsiveness and speed across all platforms and integrations.
- **Stability:** Minimal bugs and crashes, especially concerning data synchronization across integrated services.
- **User Satisfaction:** Positive feedback on usability, value, and the seamlessness of integrations.

## Team Structure
While currently a solo endeavor, the project is structured to allow for future team expansion.

- **Product Owner/Manager:** (Currently the user/developer) Defines vision, features, and prioritizes backlog.
- **Developer:** (Currently the user/developer) Responsible for design, coding, testing, and deployment.
- **AI/ML Engineer:** (Future role) Focuses on optimizing and expanding AI models (Genkit flows).
- **UI/UX Designer:** (Future role) Specializes in user interface and experience design.

## Technology Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore, Hosting, Cloud Functions)
- **AI:** Genkit (with Gemini 2.5 Flash Preview)
- **Integrations:** Google APIs (Calendar, Tasks, Drive, Keep/Docs), Stripe/RevenueCat, Slack API, Discord API, (Future: Todoist API, Notion API, Asana API), Headless CMS for Blog.

## Risks and Mitigation Strategies
- **Risk:** AI Model Limitations/Cost:
  - **Mitigation:** Start with `gemini-2.5-flash-preview-05-20` for cost-effectiveness. Optimize prompts and data structures to minimize token usage. Implement rate limiting on AI calls if needed.
- **Risk:** Cross-Platform Complexity:
  - **Mitigation:** Centralize business logic in Firebase Cloud Functions. Develop platform-specific frontends as thin clients. Prioritize one platform (Web App) for initial stability before expanding.
- **Risk:** Data Persistence & Security:
  - **Mitigation:** Strictly adhere to Firestore security rules (`request.auth.uid == userId` for private data, `request.auth != null` for public data). Ensure all data operations are authenticated. Implement robust data validation and error handling for all incoming/outgoing data, especially with third-party integrations.
- **Risk:** Third-Party API Changes/Deprecations:
  - **Mitigation:** Stay updated on API documentation for Google and other integrated services. Abstract API calls behind service layers in Cloud Functions to minimize impact of changes. Implement monitoring for API errors.
- **Risk:** Scope Creep:
  - **Mitigation:** Maintain a clear MVP definition for each phase. Strictly prioritize features based on value. Defer non-essential features to future phases.
- **Risk:** Performance Bottlenecks:
  - **Mitigation:** Monitor Firebase usage. Optimize Firestore queries (avoid `orderBy()` where possible, use client-side sorting). Implement loading states and debouncing for intensive operations, especially with external API calls.
- **Risk:** Content Management for Public Site:
  - **Mitigation:** Utilize a headless CMS or Markdown-based content system for the blog and static pages to allow for easy updates without code deployments.
- **Risk:** AI Agent Integration Security & Data Privacy:
  - **Mitigation:** Implement strict authentication and authorization for any external AI agents. Ensure user consent is obtained for data access. Clearly define what data external agents can access and modify. Adhere to all relevant data privacy regulations.