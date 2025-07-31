Zen Jar Application - Upgraded Wireframe (Updated)
This document outlines the enhanced structure and functionality of the Zen Jar application, integrating core features, growth-focused elements, public presence, and comprehensive third-party and voice integrations.

1. Overall Layout
The application uses a consistent main layout across all pages:

Component: src/components/layout/main-layout.tsx

Structure:

A persistent sidebar on the left for navigation.

A header at the top displaying the current page title, a user profile/settings button, and a Voice Control (ZenSpeak) microphone icon.

A main content area where the specific page's components are rendered.

Responsive: The sidebar collapses on smaller screens and is accessible via a trigger in the header.

2. Core Pages & Features (Internal Application)
2.1. Sidebar Navigation
Component: src/components/layout/app-sidebar.tsx

Links:

Growth: The main dashboard for tracking progress.

Task Jar: AI-powered task management.

Motivation Jar: Provides motivational quotes and affirmations.

Gratitude Jar: A journal for logging moments of gratitude.

Win Jar: A dedicated page for logging and viewing accomplishments.

Intention Setter: Helps users set a daily focus with AI support.

Settings: Access to account management, integrations, and public site links.

2.2. Growth (Dashboard)
Route: /

File: src/app/page.tsx

Title: "Growth Dashboard"

Layout: A responsive grid of cards, adapting for mobile and desktop. This is an overview page.

Components (Cards stacked in single column):

Focus Timer Card:
A dedicated card for the Focus Timer (src/components/features/dashboard/focus-timer.tsx) to track focused work sessions.

Daily Streak Card: Displays the number of consecutive days the user has completed at least one Focus Session and/or logged a Win.

Personal Records Card: Shows user records like "Longest Single Focus Session" and "Most Wins in a Day/Week."

Growth Insights Card: Visualizations (charts) of total focus time over periods, win patterns, and gratitude themes.

Win Jar Teaser: A card or button that links to the dedicated "Win Jar" page, encouraging users to log their accomplishments.

2.3. Task Jar
Route: /tasks

File: src/app/tasks/page.tsx

Title: "Task Jar"

Layout: A central, 3D WebGL scene with a task jar model. UI elements for input are overlaid.

Functionality: Users interact with a 3D jar. They can input tasks via a form or voice. The task appears as a 3D object to be dragged into the jar.

Components:

3D Scene Canvas:

Task Jar 3D Model: A rotatable, openable jar that glows.

Task Objects: When a task is added (via text or voice), a 3D scroll or object appears in the scene.

Drag & Drop: Users can drag the 3D object into the jar. A successful drop triggers an animation, sound effect, and the object becoming a visible element inside the jar.

Input Overlay:

A card with a textarea for users to input their tasks.

A "Process with AI" button.

Import Options: Buttons/dropdown for "Import from Google Keep," "Import from Google Docs."

Interaction Overlay:

Displays the list of processed tasks.

Draw a Task Button: Randomly suggests a task, highlighting its corresponding 3D object.

Empty Jar Button: Triggers a "clearing" animation for the 3D jar.

AI Sub-task Generation Button: A button next to individual tasks to "Break Down with AI," which generates sub-tasks.

2.4. Motivation Jar
Route: /motivation

File: src/app/motivation/page.tsx

Title: "Motivation Jar"

Layout: A central, 3D WebGL scene with a motivation jar model. UI elements for interaction are overlaid.

Functionality: Users can interact with the 3D jar to get a random motivational quote.

Components:

3D Scene Canvas:

Motivation Jar 3D Model: A unique, glowing jar model.

Quote Animation: When the "Draw Another" button is clicked, a light orb or particle effect emerges from the jar, and the quote appears in an overlaid blockquote.

Interaction Overlay:

A blockquote to display the current quote.

A "Draw Another" button to fetch a new random quote.

Custom Affirmations Section: An overlaid input field and save button to allow all users to add their own affirmations.

2.5. Gratitude Jar
Route: /gratitude

File: src/app/gratitude/page.tsx

Title: "Gratitude Jar"

Layout: A central, 3D WebGL scene with a gratitude jar model. UI elements for input and display are overlaid.

Functionality: Users write down and rate things they are grateful for. Entries appear as glowing objects inside the 3D jar.

Components:

3D Scene Canvas:

Gratitude Jar 3D Model: A unique, transparent jar model that visually "fills up."

Gratitude Objects: Each entry becomes a visible object (e.g., a sparkling particle, a glowing symbol) inside the jar. The size/glow of the object is based on its rating.

Input Overlay:

A textarea for the gratitude entry.

A 5-star/heart rating system.

An "Add to Jar" button. A successful add triggers a particle effect and sound as the object enters the jar.

Interaction Overlay:

A scrollable list of all submitted gratitude entries.

AI Insights Button: Button to view "Gratitude Insights."

Enhanced Visualization (Future Idea): Placeholder to toggle the "Growth View" from here.

2.6. Intention Setter
Route: /intention

File: src/app/intention/page.tsx

Title: "Intention Setter"

Layout: A central, 3D WebGL scene.

Functionality: A user writes their intention. An AI flow provides a supportive message.

Components:

3D Scene Canvas:

A stylized, floating scroll or object where the intention text is displayed.

The AI response could appear as a shimmering text block next to it.

Intention Input Overlay:

A textarea for the user's intention.

A "Set My Intention" button.

Your Daily Boost Card Overlay:

Appears after submission.

Shows a loading state while waiting for the AI.

Displays the AI-generated encouraging response.

Personalized Intentions: AI response adapts based on past intentions.

2.7. Settings Page
Route: /settings

File: src/app/settings/page.tsx

Title: "Settings"

Layout: Tabbed interface or distinct sections.

Components:

Account Information Card: User's email, name.

Subscription Management Card:

Displays current subscription status (Free/Pro+).

"Upgrade to Pro+" button (if Free).

"Manage Subscription" button (if Pro+, links to payment portal).

Integrations Card:

List of available integrations with connect/disconnect buttons.

Google Suite (Free):

Google Calendar: Toggle to enable/disable, "Connect/Disconnect" button.

Google Tasks: Toggle to enable/disable, "Connect/Disconnect" button.

Google Keep/Docs: Toggle to enable/disable, "Connect/Disconnect" button.

Google Drive (for export): Toggle to enable/disable, "Connect/Disconnect" button.

Chat Platforms (Free):

Slack: "Manage Slack Integration" (links to Slack App directory/setup guide).

Discord: "Manage Discord Integration" (links to Discord bot invite/setup guide).

Pro+ Integrations:

Todoist: "Connect/Disconnect" button.

Notion: "Connect/Disconnect" button.

Asana: "Connect/Disconnect" button.

3D & Audio Preferences:

Zen Mode Toggle: Button to enable/disable the immersive 3D background.

Sound Effects Volume: Slider to control volume of interaction sounds.

Ambient Music Toggle: Button to enable/disable background music.

About ZenJar & Our Roadmap Card:

A prominent button: "Learn More About ZenJar & Our Roadmap"

This button navigates to the public-facing section of the website.

Collaborative Jars (Pro+ Feature):

A section for managing shared jars. "Create Shared Jar" button, list of shared jars, and a button to "Manage Permissions."

2.8. Win Jar (New Dedicated Page)
Route: /wins

File: src/app/wins/page.tsx

Title: "Win Jar"

Layout: A central, 3D WebGL scene with a win jar model. Overlaid UI for input and display.

Functionality: Users log accomplishments, which are added to the 3D jar with a celebratory animation.

Components:

3D Scene Canvas:

Win Jar 3D Model: A unique, solid 3D jar model (e.g., a trophy-like jar).

Win Objects: Each win is added as a glowing 3D object (e.g., a stylized star or coin) with a celebratory particle effect and a distinctive sound.

Input Overlay:

A textarea for logging a new win.

An "Add Win" button.

Interaction Overlay:

Displays a scrollable list of all logged wins.

Growth View Teaser: A button or card that says "View your growth in the dashboard" to direct the user to the Growth page.

3. Public-Facing Website (External to Main App)
This section is accessible via the link in the Settings page and will have its own distinct routes.

3.1. About Us
Route: /public/about

File: src/app/public/about/page.tsx

Title: "About ZenJar"

Layout: Single-column content page.

Content:

ZenJar's Mission & Vision.

Explanation of the "Jar" metaphor and "Count-Up" philosophy.

Our approach to AI in wellness and productivity.

Brief story/inspiration behind ZenJar.

Key benefits and unique selling propositions.

3.2. Development Roadmap
Route: /public/roadmap

File: src/app/public/roadmap/page.tsx

Title: "ZenJar Development Roadmap"

Layout: Content page with clear sections.

Content:

High-level overview of completed features.

Current development focus (e.g., "Phase 6: Public Presence & Core Integrations").

Future planned features (e.g., "Phase 7: New ZenJar Pro+ Features & Future Enhancements").

Visually appealing representation (e.g., timeline, collapsible sections).

3.3. Blog
Route: /public/blog (list) and /public/blog/[slug] (individual post)

File: src/app/public/blog/page.tsx and src/app/public/blog/[slug]/page.tsx

Title: "ZenJar Blog"

Layout: Blog list page with article cards, individual post page with full content.

Content:

Articles on productivity, mindfulness, wellness, ZenJar tips, product updates.

Search and categorization filters.

Social sharing buttons on individual posts.

(Content managed via a headless CMS or Markdown files).

4. Cross-Platform Integrations (Conceptual UI/UX)
These are not full wireframes but describe the user interaction points for non-web platforms.

4.1. Google Chrome Extension
UI: A small, minimalist popup window when the extension icon is clicked.

Functionality:

Quick Add: Text area to quickly add a task, gratitude entry, or intention.

Quick Draw: Button to "Draw a Task" or "Get Motivation."

Focus Timer: Mini count-up timer display with start/stop.

Link to Full App: A button to open the main ZenJar web application.

4.2. Slack Bot
Interaction: Primarily via slash commands.

Commands:

/zenjar add task [your task description]: Adds a task to the Task Jar (AI processes in background).

/zenjar pick task: Randomly suggests a task from your Task Jar.

/zenjar motivate: Provides a random motivational quote.

/zenjar grateful [your gratitude entry]: Adds an entry to the Gratitude Jar.

/zenjar set intention [your intention]: Sets an intention and receives an AI response.

/zenjar focus start: Starts the count-up timer.

/zenjar focus stop: Stops the count-up timer and prompts to log a win.

/zenjar log win [your win]: Logs a win.

Responses: Bot replies in the channel (or direct message for private responses) with confirmation messages or requested content.

4.3. Discord Bot
Interaction: Similar to Slack, via slash commands and direct messages.

Commands: (Mirroring Slack commands, adapted for Discord syntax)

/zenjar addtask [your task description]

/zenjar picktask

/zenjar motivate

/zenjar grateful [your gratitude entry]

/zenjar setintention [your intention]

/zenjar focus start

/zenjar focus stop

/zenjar logwin [your win]

Responses: Bot replies in the channel or direct message.

4.4. Voice Control (ZenSpeak) Interaction (Web Application)
Activation:

Microphone Icon: A prominent microphone icon/button will be present in the main header of the web application. Clicking this activates voice listening.

(Future) Keyboard Shortcut: Consider Ctrl+Space or Cmd+Space for quick activation.

Visual Feedback during Listening:

The microphone icon will change state (e.g., color, pulsating animation)
