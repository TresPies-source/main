# Zen Jar Application - Written Wireframe

This document outlines the structure and functionality of the Zen Jar prototype, a web application designed to promote focus, gratitude, and motivation.

## 1. Overall Layout

The application uses a consistent main layout across all pages:

- **Component:** `src/components/layout/main-layout.tsx`
- **Structure:**
  - A persistent sidebar on the left for navigation.
  - A header at the top displaying the current page title and a user profile button.
  - A main content area where the specific page's components are rendered.
- **Responsive:** The sidebar collapses on smaller screens and is accessible via a trigger in the header.

## 2. Core Pages & Features

### 2.1. Sidebar Navigation

- **Component:** `src/components/layout/app-sidebar.tsx`
- **Links:**
  - **Growth:** The main dashboard.
  - **Task Jar:** AI-powered task management.
  - **Motivation Jar:** Provides motivational quotes.
  - **Gratitude Jar:** A journal for logging moments of gratitude.
  - **Intention Setter:** Helps users set a daily focus.

### 2.2. Growth (Dashboard)

- **Route:** `/`
- **File:** `src/app/page.tsx`
- **Title:** "Growth"
- **Layout:** A grid of cards.
- **Components:**
  - **Focus & Win Card (`lg:col-span-2`):**
    - **Focus Timer (`src/components/features/dashboard/focus-timer.tsx`):** A card with a start/pause/reset timer to track focus sessions. Displays time in HH:MM:SS format.
    - **Win Jar (`src/components/features/dashboard/win-jar.tsx`):** A card to log small accomplishments. Contains an input field, an "Add" button, and a scrollable list of recent wins.
  - **Daily Streak Card:** Displays the number of consecutive days the user has been active.
  - **Personal Records Card:** Shows user records like "Longest Focus Session" and "Most Wins in a Day".

### 2.3. Task Jar

- **Route:** `/tasks`
- **File:** `src/app/tasks/page.tsx`
- **Title:** "Task Jar"
- **Layout:** Two-column grid.
- **Functionality:** Users can input a list of tasks. An AI flow (`categorizeAndPrioritizeTasks`) processes the text to categorize each task (e.g., Work, Personal) and assign a priority (1-10).
- **Components:**
  - **Brain Dump Card:**
    - A large textarea for users to input their tasks.
    - A "Process with AI" button to submit the tasks.
  - **Your Tasks Card:**
    - Displays the list of processed tasks, each with a colored priority indicator, its category, and priority number.
    - **Draw a Task Button:** Opens a dialog to randomly suggest a task, weighted by priority.
    - **Empty Jar Button:** Clears all tasks from the list.

### 2.4. Motivation Jar

- **Route:** `/motivation`
- **File:** `src/app/motivation/page.tsx`
- **Title:** "Motivation Jar"
- **Layout:** A single, centered card.
- **Functionality:** Displays a random motivational quote from a predefined list.
- **Components:**
  - A blockquote to display the current quote.
  - A "Draw Another" button to fetch a new random quote.

### 2.5. Gratitude Jar

- **Route:** `/gratitude`
- **File:** `src/app/gratitude/page.tsx`
- **Title:** "Gratitude Jar"
- **Layout:** Two-column grid.
- **Functionality:** Users can write down things they are grateful for and rate their level of gratitude.
- **Components:**
  - **Add Gratitude Card:**
    - A textarea for the gratitude entry.
    - A 5-heart rating system to indicate the intensity of the feeling.
    - An "Add to Jar" button.
  - **Your Gratitude Jar Card:**
    - Displays a list of all submitted gratitude entries, sorted with the newest first.
    - The font size of each entry corresponds to its rating.
    - A disabled "AI Insights" button is present for a potential future "Pro" feature.

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
