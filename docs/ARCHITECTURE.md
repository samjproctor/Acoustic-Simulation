# Architectural Documentation

> **Project:** Acoustic Simulation
> **Documentor:** Jax Flow
> **Status:** Current

This document outlines the architectural design, technical stack, and data flow of the Acoustic Simulation platform. The system is designed to be highly modular, scalable, and resilient, enforcing strict separation of concerns between the user interface and the 3D rendering pipeline.

## 1. Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Core Framework** | React (Vite) | Declarative UI layer, optimized build pipeline, and fast HMR via Vite. |
| **3D Engine** | Three.js & `@react-three/fiber` | Wraps raw WebGL in reusable React components. |
| **3D Utilities** | `@react-three/drei` | Provides pre-built controls (`OrbitControls`) and helpers. |
| **Language** | TypeScript | Enforces strict type contracts across layer boundaries. |
| **State Management** | Zustand | Lightweight global state store, decoupling UI from 3D data flow. |
| **Testing** | Vitest + React Testing Library | Fast test runner executing within `jsdom`, supporting mock WebGL contexts. |

## 2. High-Level Modularization Strategy

The system is strictly divided into distinct layers. Each layer is isolated and may only communicate through defined contracts.

```text
┌──────────────────────────────────────────────┐
│              Core UI Layer                   │  ← App shell, React components (App.tsx)
├──────────────────────────────────────────────┤
│           Visualization Layer (3D)           │  ← WebGL Canvas, Scene objects (PoCScene.tsx)
├──────────────────────────────────────────────┤
│           Data / State Layer                 │  ← Zustand global store (store/index.ts)
├──────────────────────────────────────────────┤
│           Type Contract Layer                │  ← Shared TypeScript interfaces
└──────────────────────────────────────────────┘
```

**Key Architectural Rule:** The Visualization Layer is completely agnostic of the Core UI Layer. It reads state from the Zustand store and renders the 3D environment without explicit knowledge of the surrounding HTML structure.

## 3. Directory Architecture

The `src/` directory is structured to enforce our modularization strategy:

- `components/ui/`: Contains standard 2D React components (e.g., overlays, headers).
- `components/canvas/`: Contains 3D entities, scenes, and error boundaries for the WebGL context.
- `store/`: Contains the global Zustand state configuration (`store/index.ts`).
- `utils/`: Contains side-effect-free utility functions and the environment abstraction layer (`utils/env.ts`).
- `__tests__/`: Contains unit and regression tests for environment, state, and components.

## 4. Fault Isolation Strategy

To prevent a rendering failure in the WebGL context from crashing the entire application, a strict fault isolation strategy is implemented.
- **`CanvasErrorBoundary`**: The `<Canvas>` element is wrapped in a dedicated React Error Boundary (`src/components/canvas/CanvasErrorBoundary.tsx`). If an exception is thrown during the 3D rendering cycle, the boundary catches it and displays a graceful fallback UI. The surrounding Core UI layer remains completely functional.

## 5. State Management & Data Flow

State is managed via **Zustand** (`src/store/index.ts`).
- **State Shape**: Currently tracks `isVisualizationReady`.
- **Data Flow**: Actions (e.g., `setVisualizationReady`) update the store. Any component (UI or Canvas) can subscribe to these state changes independently. This eliminates complex prop-drilling and cross-layer coupling.

## 6. Environment Abstraction Layer

All configuration is externalized to adhere to the Open/Closed Principle.
- **`utils/env.ts`**: Provides a strongly-typed accessor for all `import.meta.env` variables. This file guarantees that application code never accesses raw environment variables directly, providing default fallbacks and strict typing for variables like `appName`, `apiUrl`, `isDev`, and `isProd`.

## 7. Testing Architecture

The QA suite is designed to execute in a `jsdom` environment utilizing `vitest`.
- **State Abstraction**: Tests validate Zustand bounds checking and state mutation mechanisms.
- **Environment Isolation**: Tests ensure fallback defaults behave correctly and that environment binaries (e.g., `isDev` and `isProd`) cannot hold anomalous simultaneous states.
- **DOM Fault Isolation**: Tests intentionally inject render exceptions to verify that `CanvasErrorBoundary` successfully catches propagation layer errors.
- **WebGL Mocking**: Because `jsdom` lacks a WebGL context, tests inject mocks for `@react-three/fiber` and its primitives (like `useFrame`) to validate component mounting and DOM tree insertion without needing a heavy browser context.
