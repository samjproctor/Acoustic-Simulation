import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CanvasErrorBoundary } from './components/canvas/CanvasErrorBoundary';
import { PoCScene } from './components/canvas/PoCScene';
import { env } from './utils/env';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="core-ui-header">
        <h1>{env.appName}</h1>
        <p>Core UI Layer - Fully Decoupled from 3D Environment</p>
      </header>
      
      <main className="visualization-container">
        <CanvasErrorBoundary>
          <Suspense fallback={<div className="canvas-loading">Loading 3D Engine...</div>}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <PoCScene />
            </Canvas>
          </Suspense>
        </CanvasErrorBoundary>
      </main>
    </div>
  );
}

export default App;
