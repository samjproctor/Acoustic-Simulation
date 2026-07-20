/**
 * @module components/canvas/RoomScene
 * @description The top-level scene graph for the Room Geometry Builder.
 * Assembles lighting, camera controls, environment, and the RoomSurfaces
 * composite into a coherent 3D environment.
 *
 * This component is entirely agnostic of Core UI concerns.
 * It reads from the store only via RoomSurfaces — it does not know the UI exists.
 */
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Environment } from '@react-three/drei';
import { RoomSurfaces } from './RoomSurfaces';
import { useRoomGeometryStore } from '../../store';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Camera Reset Utility (internal sub-component)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A non-visual sub-component that watches dimension changes and
 * repositions the camera to maintain a good framing of the room.
 * Encapsulates the useThree hook — keeping it out of the scene root.
 */
const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { dimensions } = useRoomGeometryStore();

  useEffect(() => {
    const { width, length, height } = dimensions;
    // Frame the room: position camera at a 45° isometric-ish angle
    // Distance scales with the largest room dimension
    const maxDim = Math.max(width, length, height);
    const dist = maxDim * 1.5 + 4;

    camera.position.set(dist * 0.7, dist * 0.6, dist * 0.9);
    camera.lookAt(new THREE.Vector3(0, height / 2, 0));
    camera.updateProjectionMatrix();
  }, [camera, dimensions]);

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Scene Root
// ─────────────────────────────────────────────────────────────────────────────

export const RoomScene: React.FC = () => {
  const { dimensions } = useRoomGeometryStore();
  const { width, length, height } = dimensions;

  return (
    <>
      {/* ── Lighting Rig ────────────────────────────────────────── */}
      {/* Ambient: low-intensity fill to prevent pitch-black faces */}
      <ambientLight intensity={0.35} color="#c8d4f0" />

      {/* Primary directional — simulates an overhead diffuse source */}
      <directionalLight
        position={[width * 0.5, height * 3, length * 0.5]}
        intensity={0.9}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Interior fill light — positioned at room centre, ceiling level */}
      <pointLight
        position={[0, height * 0.85, 0]}
        intensity={0.6}
        color="#a8b8e8"
        distance={Math.max(width, length) * 2}
        decay={2}
      />

      {/* Subtle rim light from below to accentuate edges */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={0.15}
        color="#6060a0"
        distance={Math.max(width, length)}
        decay={2}
      />

      {/* ── Room Geometry ────────────────────────────────────────── */}
      <RoomSurfaces />

      {/* ── Environment Grid ─────────────────────────────────────── */}
      <Grid
        position={[0, -0.005, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2a2a45"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#3d3d60"
        fadeDistance={40}
        fadeStrength={1.5}
        infiniteGrid
      />

      {/* ── Camera Controls ──────────────────────────────────────── */}
      <CameraController />
      <OrbitControls
        makeDefault
        target={[0, height / 2, 0]}
        enableDamping
        dampingFactor={0.08}
        minDistance={1}
        maxDistance={100}
        maxPolarAngle={Math.PI * 0.92}
      />

      {/* ── Orientation Gizmo ────────────────────────────────────── */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={['#f87171', '#4ade80', '#60a5fa']}
          labelColor="white"
          axisHeadScale={1.1}
        />
      </GizmoHelper>
    </>
  );
};
