/**
 * @module components/canvas/RoomWall
 * @description An atomic 3D canvas component representing a single room wall.
 * Fully generic — all spatial configuration is injected via props.
 * The composite RoomSurfaces component is responsible for correctly
 * configuring position, rotation, and dimensions for each named wall.
 */
import React from 'react';
import * as THREE from 'three';

interface RoomWallProps {
  /** Width of the wall plane (corresponds to the room axis parallel to the wall). */
  planeWidth: number;
  /** Height of the wall plane. */
  planeHeight: number;
  /** World-space position of the wall centre. */
  position: [number, number, number];
  /** Euler rotation of the wall plane. */
  rotation: [number, number, number];
  /** Base color of the wall material. */
  color: string;
  /** Opacity of the primary material (0–1). */
  opacity: number;
  /** Whether this surface is rendered. */
  visible: boolean;
}

export const RoomWall: React.FC<RoomWallProps> = ({
  planeWidth,
  planeHeight,
  position,
  rotation,
  color,
  opacity,
  visible,
}) => {
  // Segment counts for structural grid visualization
  const segW = Math.max(1, Math.ceil(planeWidth));
  const segH = Math.max(1, Math.ceil(planeHeight));

  return (
    <group position={position} rotation={rotation} visible={visible}>
      {/* Primary surface mesh */}
      <mesh receiveShadow castShadow>
        <planeGeometry args={[planeWidth, planeHeight, segW, segH]} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0.05}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Structural wireframe overlay */}
      <mesh>
        <planeGeometry args={[planeWidth, planeHeight, segW, segH]} />
        <meshBasicMaterial
          color="#5c6bc0"
          wireframe
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Perimeter edge highlight — uses line segments on the boundary */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(planeWidth, planeHeight)]} />
        <lineBasicMaterial color="#7986cb" transparent opacity={0.8} linewidth={1} />
      </lineSegments>
    </group>
  );
};
