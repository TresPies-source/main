# **App Name**: Zen Jar

## Core Features:

- AI-Powered Task Jar: Allows users to brain dump tasks. AI automatically categorizes tasks (e.g., Work, Personal) and assigns priority (1-10). Enables weighted random selection of tasks, favoring higher priorities. Provides data persistence for tasks via Google account. Includes an option to empty the jar for a fresh start. Offers unlimited tasks in the Pro tier, with a limit for the free tier. Pro tier includes AI-powered sub-task generation for complex items.
- Motivation Jar: Serves as a source of instant encouragement and procrastination relief. Contains a curated collection of affirmations and motivational quotes. Users can draw random sayings for a quick boost. Pro tier allows users to add custom affirmations.
- Gratitude Jar: Maintains an ongoing, persistent list of grateful moments. Users can rate gratitude entries from 1 to 5. Visually represents gratitude, with more frequent/higher-rated items appearing more prominent. Pro tier offers AI-powered insights into gratitude patterns. Pro tier includes unlimited gratitude entries, with a limit for the free tier. Future plans include enhanced, dynamic visual representations of gratitude.
- AI-Powered Intention Setter: Provides a simple interface for users to state their daily goals or intentions. AI generates supportive and encouraging responses to user intentions. Pro tier offers personalized responses based on past intentions. Future plans include guided, multi-step intention setting and reflection.
- Focus Timer & "Win" Jar (The "Growth" Ecosystem): Focus Timer: A unique count-up timer that measures sustained concentration, starting from 00:00. Win Jar: A dedicated space for users to log accomplishments and build confidence. Streaks & Personal Records: Tracks consecutive days of focus sessions and logged wins, highlighting personal bests. The free tier provides full access to the count-up timer and basic win/streak tracking. The Pro tier includes an advanced Growth Dashboard with historical data, charts, and AI-powered insights into focus habits and wins. Pro tier offers unlimited win logging and advanced streak tracking.
- Cross-Platform Accessibility: Core Web Application (Next.js) for a full visual experience. Google Chrome Extension for quick-access functionality. Integrations with Slack and Discord via bots and slash commands.
- Robust Backend & AI Integration: Utilizes Firebase for authentication (Google Sign-In), real-time data storage (Firestore), and hosting. Leverages Firebase Cloud Functions with Genkit for AI-powered features (task processing, intention responses) and bot integrations.
- Freemium Monetization Model: Offers a comprehensive free tier with core functionalities to provide immediate value. Introduces a subscription-based Pro tier for advanced features, unlimited usage, deeper insights, and integrations.

## Style Guidelines:

- Centered on Calm Clarity, aiming to reduce anxiety and promote focus through visual design.
- Zen Teal (`#8BAA7A`) as the primary accent for interactive elements. Soft, light Parchment (`#F3F0E9`) for light mode backgrounds. Deep Charcoal (`#2A2F32`) for dark mode backgrounds and light mode text. Soft, off-white Parchment (`#F3F0E9`) for dark mode text. Slate Gray (`#5B6467`) for main UI elements and headers.
- Tasks: A calm, muted blue to promote focus. Motivation: A warm, gentle pinkish-coral for encouragement. Gratitude: A soft, earthy green representing growth and well-being.
- Muted green for success indicators. Soft yellow/amber for warnings. Calm, desaturated red for errors. Light gray for disabled elements.
- Serif fonts (e.g., Lora, Merriweather) for headings in light mode to add elegance. Clean sans-serif fonts (e.g., Inter, Lato, Source Sans Pro) for body text across all modes for readability. Consistent use of a single sans-serif family in different weights for dark mode.
- Clean, uncluttered interfaces to minimize distractions.
- Avoids harsh lines, sharp edges, and overly bright, jarring colors.
- Uses color and subtle cues to guide user interaction and understanding.
- Ensures a cohesive and recognizable brand identity across all deployment surfaces.
- Prioritizes sufficient color contrast for readability and usability for all users.
- Adapts seamlessly to all device sizes and orientations (mobile, tablet, desktop).
- Applied to all UI elements for a softer, more approachable look.
- The preferred default font for most textual content.
- Exclusive use of Tailwind utility classes for all styling to maintain consistency and efficiency.