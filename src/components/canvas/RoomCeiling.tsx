/**
 * @module components/canvas/RoomCeiling
 * @description An atomic 3D canvas component representing the room ceiling surface.
 * Positioned at Y=height, rotated to face downward into the room interior.
 */
import React from 'react';
import * as THREE from 'three';
import type { RoomDimensions } from '../../types';

interface RoomCeilingProps {
  dimensions: RoomDimensions;
  visible: boolean;
}

export const RoomCeiling: React.FC<RoomCeilingProps> = ({ dimensions, visible }) => {
  const { width, length, height } = dimensions;

  return (
    <group visible={visible}>
      {/* Primary surface — semi-transparent to allow interior visibility */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length, Math.ceil(width), Math.ceil(length)]} />
        <meshStandardMaterial
          color="#1e1e30"
          roughness={0.9}
          metalness={0.0}
          transparent
          opacity={0.7}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height - 0.001, 0]}
      >
        <planeGeometry args={[width, length, Math.ceil(width), Math.ceil(length)]} />
        <meshBasicMaterial color="#4a4a7a" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
};
