ZenJar Comprehensive Project Document
This document provides a holistic overview of the ZenJar application, encompassing its definition, core functionalities, aesthetic principles, detailed development roadmap, and project management strategies.

1. ZenJar Overview & Definition
Project Name: ZenJar
One-Liner: ZenJar is a minimalist, multi-platform wellness and productivity tool that uses AI-powered "jars" to help users organize tasks, find motivation, practice gratitude, and build confidence through a unique "count-up" approach to focus and accomplishments.

Project Category: AI Tool, Wellness App, Productivity App

The Story: In a world of overwhelming to-do lists and constant distractions, ZenJar was conceived to combat digital fatigue and foster mindfulness. Traditional productivity tools often often focus on deadlines and "counting down," which can induce stress. ZenJar flips this script by embracing a "count-up" philosophy, turning focus and achievements into tangible, growing assets. Its uniqueness lies in its simple, satisfying "jar" metaphor, combined with intelligent AI that automates organization and provides supportive insights, all accessible across various platforms.

Creative Assets:

A clean, minimalist logo featuring a stylized jar with a calming, muted teal color.

Promotional imagery depicting three glowing jars (Tasks, Motivation, Gratitude) on a serene desk setting, symbolizing clarity and focus.

Core Features
I. AI-Powered Task Jar
Brain Dump Input: Users can input unstructured text (a "brain dump") containing multiple tasks.

AI-Powered Categorization: An AI flow automatically processes the input text, splitting it into individual tasks.

AI-Powered Sub-Task Generation: For larger tasks, the AI can suggest breaking them down into smaller, manageable steps.

Priority Assignment: Each task is assigned a priority level from 1 to 10 by the AI.

Color-Coded Categories: Tasks are automatically assigned to color-coded categories (e.g., Work, Personal, Health, Errand) by the AI.

Weighted Random Selection: Users can "pick" a task from the jar, with higher-priority items having a greater likelihood of being chosen.

Persistence: All tasks are saved to the user's Google account for data persistence.

Jar Control: Users have the option to "empty the jar" to start fresh.

Unlimited Tasks: All users have access to unlimited active tasks.

II. Motivation Jar
Procrastination Relief: Designed as a tool to help users overcome procrastination.

Curated Content: The jar is pre-filled with a curated collection of affirmations, motivational quotes, and encouraging statements.

Random Draw: Users can "draw" a random affirmation from the jar whenever they need a boost.

Custom Affirmations: All users can add their own quotes, mantras, and affirmations to the Motivation Jar.

III. Gratitude Jar
Persistent List: An ongoing, persistent list where users can record things they are grateful for.

Gratitude Rating: When adding an item, users can assign a gratitude rating from 1 to 5.

Visual Weighting: The jar's interface visually represents the gratitude list, with items added more frequently or having higher ratings appearing "bigger" or more prominent.

Unlimited Entries: All users have access to unlimited gratitude entries.

Gratitude Insights: An AI-powered dashboard analyzes gratitude entries over time, identifying recurring themes and patterns.

Enhanced Visualization (Future Idea): Dynamic visualization of the Gratitude Jar, like a growing tree or a constellation, to make the practice more engaging.

IV. AI-Powered Intention Setter
Goal Setting: A simple tool for users to state their daily goal or a specific task intention.

Supportive AI Response: After a user types their intention, an AI provides a short, supportive, and encouraging response.

Personalized Intentions: The Intention Setter AI remembers past intentions and provides tailored encouragement, helping users track progress and stay consistent.

Guided Intention Setting & Reflection (Future Idea): An enhanced, multi-step version guiding users with prompts and daily reflections.

V. Focus Timer & "Win" Jar (The "Growth" Ecosystem)
Focus Timer (Count-Up):

Replaces traditional countdown timers; starts at 00:00 and counts up to measure sustained concentration.

Users initiate a session after picking a task and stop it when finished or losing focus.

Total time is logged as a "Focus Session."

"Win" Jar:

A dedicated space for users to quickly record daily or weekly accomplishments.

Prompts users to log wins after Focus Sessions; manual win entry also available.

Unlimited wins for all users.

Streaks & Personal Records:

Focus Streaks: Tracks consecutive days with at least one Focus Session.

Win Streaks: Tracks consecutive days with an entry in the "Win" Jar.

Personal Bests: Highlights the user's longest uninterrupted Focus Session.

Growth Dashboard: A personal dashboard visualizing progress and accumulated strength over time.

Includes charts for total focus time, celebration of personal bests, and streak tracking.

AI-driven insights from the "Win" Jar.

Task-Timer Association: Link specific Focus Sessions to completed tasks to track dedicated time per project.

VI. Cross-Platform Accessibility
Core Web Application: A clean, minimalist Next.js web app hosted on Firebase Hosting, serving as the primary interface.

Google Extension: A lightweight browser extension for quick-access functionality.

Integrations with Slack and Discord: Via bots and slash commands.

VII. Robust Backend & AI Integration
Google Sign-In: Firebase Authentication for user account management.

Firestore Database: Stores all user data, including jars, items, and intentions, with real-time updates.

Cloud Functions: Used for AI logic (Task Jar parsing, Intention Setter responses) and handling Slack/Discord bot commands.

VIII. Freemium Monetization Model
Free Tier: All users now have access to all original "ZenJar Pro" features, including unlimited usage and the Growth Dashboard. This provides an extremely powerful and valuable core product.

ZenJar Pro+ (New Premium Tier): We will introduce a new subscription-based tier for highly advanced features, catering to power users, teams, and those who desire deep customization and proactive AI assistance.

IX. Voice Control (ZenSpeak)
Purpose: To provide a hands-free, intuitive way for users to engage with ZenJar, making it more accessible and efficient for quick interactions.

Microphone Activation: Prominent microphone icon/button in the UI, potentially with a keyboard shortcut.

Visual Feedback: Real-time text transcription of user speech, visual cues for listening, processing, and command status.

Speech-to-Text (STT): Utilizes browser's Web Speech API for client-side conversion, with robust error handling.

Backend Natural Language Understanding (NLU):

A new Firebase Cloud Function receives transcribed text.

Uses Genkit with gemini-2.5-flash-preview-05-20 to identify user intent (e.g., addTask, pickTask, getMotivation, addGratitude, setIntention).

Extracts relevant entities (e.g., taskContent, gratitudeContent, intentionContent).

Integrates with existing ZenJar backend logic based on identified intent.

Includes error handling and clarification prompts for unclear commands.

Core Voice Commands (MVP): Add tasks, pick tasks, get motivation, add gratitude entries, set intentions.

Future Enhancements: Voice-based rating, complex queries, voice navigation, wake word activation.

X. 3D Immersive Experience
Core Concept: Transform the static jars into animated, rotatable, and fillable 3D objects within a beautiful WebGL scene.

3D Jars: Each jar (Task, Gratitude, Motivation, etc.) will be a custom 3D model with unique behaviors, such as rotating, opening their lid, and glowing.

Drag & Drop: User interactions like removing an item will involve a dynamic animation mechanism, triggering sound and particle effects.

Zen Mode: A toggleable immersive mode that places the jars in serene 3D environments (e.g., space, a forest).

Growth View: A "zoom out" view (future phase) that visualizes user accomplishments as a growing celestial constellation or a vibrant garden.

ZenSpeak to Object: Voice commands will be tied to 3D visual feedback, where a spoken command (e.g., "Add task") makes a 3D object (e.g., a parchment scroll) appear for the user that either adds or removes itself to the jar.

New ZenJar Pro+ Features (Monetization Plan)
Proactive AI Agent:

An advanced, opt-in AI agent that proactively suggests tasks from integrated services (e.g., emails, calendar events) and adds them to the Task Jar for review.

AI-powered analysis of your growth data to provide personalized recommendations for improving focus and well-being.

Collaborative Shared Jars:

Create and share any jar type (Tasks, Gratitude, Wins) with other ZenJar Pro+ users.

Real-time synchronization for family task lists, team brainstorming, or shared gratitude.

Advanced 3D & Customization:

Unlock premium 3D environments for Zen Mode (e.g., underwater reef, celestial nebula).

Access to an exclusive library of custom 3D jar models and interaction animations.

Premium Integrations & API Access:

Full bi-directional synchronization with advanced productivity tools like Notion, Asana, and Todoist.

API keys for developers to build their own integrations with their ZenJar data.

Style Guidelines
I. Overall Color Philosophy: Calm Clarity
Goal: Reduce anxiety, promote focus, and provide a soft, accessible, and purposeful visual experience.

Palette: Soft, muted tones with distinct, thematic colors for each jar.

II. Primary Color Palette (Default: Kyoto Garden)
Primary Accent (Zen Teal): #8BAA7A (Matcha Green) - For buttons, links, active states, and general accents.

Background (Light Mode - Parchment): #F3F0E9 - Soft, light gray, easy on the eyes.

Background (Dark Mode - Deep Charcoal): #2A2F32 - Deep charcoal blue, calming, makes accents pop gently.

Text (Light Mode - Deep Charcoal): #2A2F32 - Dark gray for body text, reducing high contrast.

Text (Dark Mode - Parchment): #F3F0E9 - Soft, off-white for body text, ensuring readability.

Main UI Elements/Headers: #5B6467 (Slate Gray)

III. Jar-Specific Accent Colors
Task Jar (Focus Blue): A calm, intelligent, and muted blue. Promotes focus and clarity.

Motivation Jar (Inspire Coral): A warm, gentle pinkish-coral. Encouraging, hopeful, and positive.

Gratitude Jar (Gratitude Green): A soft, earthy, and warm green. Represents growth, peace, and well-being.

IV. UI States & Accents
Success: A gentle, muted green (distinct from Gratitude Green).

Warning: A soft, muted yellow or amber.

Error: A calm, desaturated