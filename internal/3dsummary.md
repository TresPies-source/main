🧭 3D Expansion Summary for ZenJar
🌐 Core Concept
Turn each Jar (Task, Gratitude, Motivation, Intention, Win) into a beautifully animated, rotatable, openable, and fillable 3D object — living inside a WebGL scene that responds to mood and input.

🪄 Key Imaginative Enhancements
🧱 Jars in 3D
Fully modeled: Custom GLTF or glb files for each jar type.

Behavior: Rotate, open lid, glow gently, and animate on item drop.

Fillable: Each added item becomes a visible object inside the jar (scrolls, light orbs, affirmations).

✨ Drag & Drop Interactions
Use raycasting within `three.js` for pointer detection.

Simple animation loops or a lightweight physics library for natural item movement.

Dropped objects trigger:

Sound (via tone.js)

Particle effects (e.g., ripple rings, sparks)

Jar “fill” animation or glow pulse

🌌 Zen Mode
Toggle into immersive mode:

Floating scene in space, forest, or beneath water

Parallax layers and particle skies

Timer floats softly

UI fades away

🌳 Growth View (Later Phases)
“Zoom out” from jars into a garden or celestial constellation

Constellation lights up with accomplishments (wins, focus, gratitude)

Unlock new environments as milestones are hit

🔉 Audio + Ambience
Scene-based ambient tracks: Lo-fi rain, synth forest, wind cave, etc.

Item-specific SFX:

Tasks = parchment scroll flutter

Gratitude = sparkle pop

Wins = gong or piano chime

🧠 ZenSpeak: Voice to Object
Speak: “Add task: Send email to Joy”

Visual: Scroll unrolls in air → user drags it into jar

Visual feedback from mic icon, and optional “whispering guide” response

🛠️ Technical Layers
Layer	Tools
WebGL Rendering	three.js (Imperative Approach)
React Integration	Mounted in a React component's `useEffect` hook.
UI	Tailwind CSS for overlays
Physics (optional)	Simple animation loops or a small physics library.
Audio	tone.js or howler.js
Voice	Web Speech API + Firebase Functions
AI	Firebase Genkit + Gemini
Data Persistence	Firestore
Models	.glb / .gltf via Blender, Sketchfab, or Remix3D
