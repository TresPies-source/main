# Zen Jar Application - Upgraded Wireframe
This document outlines the enhanced structure and functionality of the Zen Jar application, integrating core features, growth-focused elements, public presence, and third-party integrations.

## 1. Overall Layout
The application uses a consistent main layout across all pages:

**Component:** `src/components/layout/main-layout.tsx`

**Structure:**

- A persistent sidebar on the left for navigation.
- A header at the top displaying the current page title and a user profile/settings button.
- A main content area where the specific page's components are rendered.
- **Responsive:** The sidebar collapses on smaller screens and is accessible via a trigger in the header.

## 2. Core Pages & Features (Internal Application)
### 2.1. Sidebar Navigation
**Component:** `src/components/layout/app-sidebar.tsx`

**Links:**

- **Growth:** The main dashboard for tracking progress.
- **Task Jar:** AI-powered task management.
- **Motivation Jar:** Provides motivational quotes and affirmations.
- **Gratitude Jar:** A journal for logging moments of gratitude.
- **Intention Setter:** Helps users set a daily focus with AI support.
- **Settings:** Access to account management, integrations, and public site links.

### 2.2. Growth (Dashboard)
- **Route:** `/`
- **File:** `src/app/page.tsx`
- **Title:** "Growth Dashboard"
- **Layout:** A responsive grid of cards, adapting for mobile and desktop.
- **Components:**
  - **Focus & Win Card (`lg:col-span-2`):**
    - **Focus Timer (`src/components/features/dashboard/focus-timer.tsx`):** A card with a start/stop button for a count-up timer to track focused work sessions (displays HH:MM:SS).
    - **Win Jar (`src/components/features/dashboard/win-jar.tsx`):** A card to log accomplishments. Contains an input field, an "Add Win" button, and a scrollable list of recent wins.
    - **Link Task to Focus Session:** (Pro Feature) Option to associate a completed task with a focus session.
  - **Daily Streak Card:** Displays the number of consecutive days the user has completed at least one Focus Session and/or logged a Win.
  - **Personal Records Card:** Shows user records like "Longest Single Focus Session" and "Most Wins in a Day/Week."
  - **Growth Insights Card (Pro Feature):** (Initially disabled/placeholder) Visualizations (charts) of total focus time over periods, win patterns, and gratitude themes. Includes a clear "Upgrade to Pro" call-to-action if not subscribed.

### 2.3. Task Jar
- **Route:** `/tasks`
- **File:** `src/app/tasks/page.tsx`
- **Title:** "Task Jar"
- **Layout:** Two-column grid on larger screens, stacked on smaller screens.
- **Functionality:** Users can input a list of tasks. An AI flow (`categorizeAndPrioritizeTasks`) processes the text to categorize each task (e.g., Work, Personal) and assign a priority (1-10). Tasks are persisted and can be managed.
- **Components:**
  - **Brain Dump Card:**
    - A large textarea for users to input their tasks.
    - A "Process with AI" button to submit the tasks.
    - **Import Options:** Buttons/dropdown for "Import from Google Keep," "Import from Google Docs" (requires integration setup in Settings).
  - **Your Tasks Card:**
    - Displays the list of processed tasks, each with a colored category indicator, its priority number, and a status (pending/completed).
    - **Task Actions:** Checkbox to mark as complete, edit button, delete button.
    - **Draw a Task Button:** Opens a dialog to randomly suggest a task, weighted by priority.
    - **Empty Jar Button:** Clears all tasks from the list (with confirmation dialog).
    - **Export Options:** Button/dropdown for "Export to Google Tasks," "Export to Google Calendar" (requires integration setup in Settings).
  - **Free Tier Limit Indicator:** (If applicable) Displays "X/50 tasks" with an "Upgrade to Pro for Unlimited" prompt.
  - **AI Sub-task Generation (Pro Feature):** (Initially disabled/placeholder) A button next to individual tasks to "Break Down with AI," which generates sub-tasks.

### 2.4. Motivation Jar
- **Route:** `/motivation`
- **File:** `src/app/motivation/page.tsx`
- **Title:** "Motivation Jar"
- **Layout:** A single, centered card.
- **Functionality:** Displays a random motivational quote or affirmation from a predefined list.
- **Components:**
  - A blockquote to display the current quote/affirmation.
  - A "Draw Another" button to fetch a new random quote.
  - **Custom Affirmations (Pro Feature):** (Initially disabled/placeholder) A section or button to "Add Your Own Affirmation" (input field and save button).

### 2.5. Gratitude Jar
- **Route:** `/gratitude`
- **File:** `src/app/gratitude/page.tsx`
- **Title:** "Gratitude Jar"
- **Layout:** Two-column grid on larger screens, stacked on smaller screens.
- **Functionality:** Users can write down things they are grateful for and rate their level of gratitude. Entries are persisted and visually weighted.
- **Components:**
  - **Add Gratitude Card:**
    - A textarea for the gratitude entry.
    - A 5-star/heart rating system to indicate the intensity of the feeling.
    - An "Add to Jar" button.
  - **Free Tier Limit Indicator:** (If applicable) Displays "X/100 entries" with an "Upgrade to Pro for Unlimited" prompt.
  - **Your Gratitude Jar Card:**
    - Displays a list of all submitted gratitude entries, sorted with the newest first.
    - The font size/prominence of each entry corresponds to its rating.
  - **AI Insights Button (Pro Feature):** (Initially disabled/placeholder) Button to view "Gratitude Insights" (e.g., recurring themes, patterns).
  - **Enhanced Visualization (Future Idea):** Placeholder for a dynamic, interactive visualization (e.g., a "growth tree" or "constellation" of gratitude).

### 2.6. Intention Setter
- **Route:** `/intention`
- **File:** `src/app/intention/page.tsx`
- **Title:** "Intention Setter"
- **Layout:** A primary card for input and a secondary card for the AI's response.
- **Functionality:** A user writes their intention for the day. An AI flow (`generateEncouragingResponse`) takes the intention and provides a supportive, encouraging message.
- **Components:**
  - **Intention Input Card:**
    - A textarea for the user's intention.
    - A "Set My Intention" button.
  - **Your Daily Boost Card:**
    - Appears after submission.
    - Shows a loading state while waiting for the AI.
    - Displays the AI-generated encouraging response.
  - **Personalized Intentions (Pro Feature):** (Initially disabled/placeholder) AI response adapts based on past intentions.
  - **Guided Intention Setting (Future Idea):** Placeholder for a multi-step prompt system.

### 2.7. Settings Page
- **Route:** `/settings`
- **File:** `src/app/settings/page.tsx`
- **Title:** "Settings"
- **Layout:** Tabbed interface or distinct sections.
- **Components:**
  - **Account Information Card:** User's email, name.
  - **Subscription Management Card:**
    - Displays current subscription status (Free/Pro).
    - "Upgrade to Pro" button (if Free).
    - "Manage Subscription" button (if Pro, links to payment portal).
  - **Integrations Card:**
    - List of available integrations with connect/disconnect buttons.
    - **Google Suite:**
      - Google Calendar: Toggle to enable/disable, "Connect/Disconnect" button.
      - Google Tasks: Toggle to enable/disable, "Connect/Disconnect" button.
      - Google Keep/Docs: Toggle to enable/disable, "Connect/Disconnect" button.
      - Google Drive (for export): Toggle to enable/disable, "Connect/Disconnect" button.
    - **Chat Platforms:**
      - Slack: "Manage Slack Integration" (links to Slack App directory/setup guide).
      - Discord: "Manage Discord Integration" (links to Discord bot invite/setup guide).
    - **Other Productivity Tools (Pro Feature - Future):**
      - Todoist: "Connect/Disconnect" button.
      - Notion: "Connect/Disconnect" button.
      - Asana: "Connect/Disconnect" button.
  - **Data Management Card:**
    - "Export All Data" button (exports to Google Drive if connected, otherwise offers download).
  - **About ZenJar & Our Roadmap Card:**
    - A prominent button: "Learn More About ZenJar & Our Roadmap"
    - This button navigates to the public-facing section of the website.

## 3. Public-Facing Website (External to Main App)
This section is accessible via a link below the Settings link and above the logout button and will have its own distinct routes.

### 3.1. About Us
- **Route:** `/public/about`
- **File:** `src/app/public/about/page.tsx`
- **Title:** "About ZenJar"
- **Layout:** Single-column content page.
- **Content:**
  - ZenJar's Mission & Vision.
  - Explanation of the "Jar" metaphor and "Count-Up" philosophy.
  - Our approach to AI in wellness and productivity.
  - Brief story/inspiration behind ZenJar.
  - Key benefits and unique selling propositions.

### 3.2. Development Roadmap
- **Route:** `/public/roadmap`
- **File:** `src/app/public/roadmap/page.tsx`
- **Title:** "ZenJar Development Roadmap"
- **Layout:** Content page with clear sections.
- **Content:**
  - High-level overview of completed features.
  - Current development focus (e.g., "Phase 6: Public Presence & Core Integrations").
  - Future planned features (e.g., "Phase 7: Advanced Integrations & Future Enhancements").
  - Visually appealing representation (e.g., timeline, collapsible sections).

### 3.3. Blog
- **Route:** `/public/blog` (list) and `/public/blog/[slug]` (individual post)
- **File:** `src/app/public/blog/page.tsx` and `src/app/public/blog/[slug]/page.tsx`
- **Title:** "ZenJar Blog"
- **Layout:** Blog list page with article cards, individual post page with full content.
- **Content:**
  - Articles on productivity, mindfulness, wellness, ZenJar tips, product updates.
  - Search and categorization filters.
  - Social sharing buttons on individual posts.
  - (Content managed via a headless CMS or Markdown files).

## 4. Cross-Platform Integrations (Conceptual UI/UX)
These are not full wireframes but describe the user interaction points for non-web platforms.

### 4.1. Google Chrome Extension
- **UI:** A small, minimalist popup window when the extension icon is clicked.
- **Functionality:**
  - **Quick Add:** Text area to quickly add a task, gratitude entry, or intention.
  - **Quick Draw:** Button to "Draw a Task" or "Get Motivation."
  - **Focus Timer:** Mini count-up timer display with start/stop.
  - **Link to Full App:** A button to open the main ZenJar web application.

### 4.2. Slack Bot
- **Interaction:** Primarily via slash commands.
- **Commands:**
  - `/zenjar add task [your task description]`: Adds a task to the Task Jar (AI processes in background).
  - `/zenjar pick task`: Randomly suggests a task from your Task Jar.
  - `/zenjar motivate`: Provides a random motivational quote.
  - `/zenjar grateful [your gratitude entry]`: Adds an entry to the Gratitude Jar.
  - `/zenjar set intention [your intention]`: Sets an intention and receives an AI response.
  - `/zenjar focus start`: Starts the count-up timer.
  - `/zenjar focus stop`: Stops the count-up timer and prompts to log a win.
  - `/zenjar log win [your win]`: Logs a win.
- **Responses:** Bot replies in the channel (or direct message for private responses) with confirmation messages or requested content.

### 4.3. Discord Bot
- **Interaction:** Similar to Slack, via slash commands and direct messages.
- **Commands:** (Mirroring Slack commands, adapted for Discord syntax)
  - `/zenjar addtask [your task description]`
  - `/zenjar picktask`
  - `/zenjar motivate`
  - `/zenjar grateful [your gratitude entry]`
  - `/zenjar setintention [your intention]`
  - `/zenjar focus start`
  - `/zenjar focus stop`
  - `/zenjar logwin [your win]`
- **Responses:** Bot replies in the channel or direct message.