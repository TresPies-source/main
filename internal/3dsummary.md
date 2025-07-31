# ZenJar 3D Overhaul Plan

This document outlines the strategy for a complete refactor of the ZenJar application to integrate robust and stable 3D functionality. The core of this plan is to shift from a declarative, wrapper-based approach to an imperative `three.js` implementation to ensure stability and control.

### Core Strategy: Imperative `three.js` in a React Context

- **Primary Library:** We will use the foundational `three.js` library directly for all 3D rendering.
- **Architecture:** The declarative `@react-three/fiber` library will be removed. Each 3D scene will be managed by a dedicated JavaScript/TypeScript class or module. The corresponding React component will be responsible for instantiating this scene manager and mounting its `<canvas>` element into the DOM.
- **Benefit:** This architecture cleanly separates the `three.js` render loop and scene graph from React's virtual DOM and reconciler. This will prevent the `ReactCurrentOwner` dependency conflicts that previously blocked development.

---

### Phase 1: Foundational Scene Architecture (The Blueprint)

- **Objective:** Create a single, stable, and reusable 3D scene component that can be adapted for all "Jar" pages. This will be our foundational blueprint.
- **Hurdle:** Managing `three.js` objects and the render loop imperatively within a functional React component's lifecycle.
- **Solution:**
    1.  **DOM Mounting:** We will use `useRef` to get a stable reference to a container `<div>` in our React component.
    2.  **Initialization:** We will use `useEffect` with an empty dependency array `[]` to perform the one-time setup. Inside this effect, we will:
        - Instantiate our custom `three.js` scene manager class.
        - Initialize the scene, camera, lights, and renderer.
        - Append the renderer's `<canvas>` element to the `div` from our `useRef`.
        - Start the animation loop.
    3.  **Cleanup:** The return function from the `useEffect` hook will handle cleanup: stopping the animation loop and disposing of `three.js` objects to prevent memory leaks.

### Phase 2: State Management & UI-3D Communication

- **Objective:** Enable the React UI overlays to communicate with and control the 3D scene.
- **Hurdle:** Passing data and triggering events between the declarative React UI and the imperative `three.js` scene.
- **Solution:**
    - **One-Way Data Flow:** We will use React props to pass data down to the `useEffect` hook that manages the `three.js` scene.
    - **Example:** When a user adds a task, a state `playTaskAnimation` will be set to `true`. This will be a dependency in our `useEffect`. When the effect re-runs, it can call a method on our scene manager instance (e.g., `mySceneManager.triggerPopAnimation()`) to run the 3D animation. This keeps the state management within React while triggering imperative actions in `three.js`.

### Phase 3: Asset Loading & Performance Optimization

- **Objective:** Load custom 3D models (`.glb` files) for the jars and ensure the application remains performant.
- **Hurdle:** Large 3D model files can significantly slow down initial page load and harm user experience.
- **Solution:**
    1.  **Dynamic Imports:** The parent React components containing the 3D scenes will be loaded using `next/dynamic`. This code-splitting is essential to keep the initial bundle size small.
    2.  **Asynchronous Asset Loading:** We will use the `GLTFLoader` from `three.js` to load models asynchronously. Loading screens or placeholders will be displayed in the React UI while the assets are being fetched.
    3.  **Asset Compression:** We will establish a workflow to compress all 3D models using tools like `gltfpack` and Draco compression before they are added to the project.

### Phase 4: Interactivity & Physics

- **Objective:** Implement drag-and-drop functionality, pointer interactions, and realistic object movement.
- **Hurdle:** Calculating pointer positions in 3D space and simulating physics without a heavy library.
- **Solution:**
    - **Raycasting:** We will use `three.js`'s built-in `Raycaster` to translate the 2D mouse coordinates into the 3D scene. This will allow us to detect which objects the user is hovering over or clicking on.
    - **Simple Physics:** For simple interactions like an object falling into a jar, we will write basic animation loops that simulate gravity and collision, avoiding the need for a full physics engine initially.
    - **Future-Proofing:** For more advanced physics later, this architecture will easily accommodate a lightweight library like `cannon-es`, which can be integrated into our imperative `three.js` scene manager.
