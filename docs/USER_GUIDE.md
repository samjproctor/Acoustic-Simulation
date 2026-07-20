# User Guide: Acoustic Simulation Platform

Welcome to the Acoustic Simulation platform. This guide provides instructions on how to set up, run, and interact with the application.

## Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **npm**: Node Package Manager.

## Installation
1. Clone the repository and navigate to the project directory.
2. Install the dependencies by running:
   ```bash
   npm install
   ```

## Running the Application
To start the local development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port provided in the terminal). 

## Interacting with the 3D Visualization
The core of the application features a 3D visualization canvas powered by WebGL.
- **Rotate**: Click and drag within the canvas to rotate the camera around the central object.
- **Zoom**: Use your mouse scroll wheel to zoom in and out.
- **Pan**: Right-click and drag to move the camera focus point.

## Running Tests
The project includes a comprehensive automated QA suite to ensure structural integrity and fault isolation. To execute the test suite:
```bash
npm run test
```
The test suite utilizes `vitest` and `jsdom` to validate the environment, state management, and component rendering without requiring a full browser environment.

## Environment Variables
The application utilizes environment variables for configuration. The following files are available in the root directory:
- `.env.development`: For local development overrides.
- `.env.production`: For production-grade configuration.

Current available configuration variables:
- `VITE_APP_NAME`: The name of the application (default: "Acoustic Simulation").
- `VITE_API_URL`: The base URL for API connections.
