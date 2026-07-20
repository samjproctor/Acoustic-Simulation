/**
 * @module components/canvas/RoomFloor
 * @description An atomic 3D canvas component representing the room floor surface.
 * Consumes dimensions as explicit props — entirely agnostic of the store.
 * Positioned at Y=0, rotated to face upward.
 */
import React from 'react';
import * as THREE from 'three';
import type { RoomDimensions } from '../../types';

interface RoomFloorProps {
  dimensions: RoomDimensions;
  visible: boolean;
}

export const RoomFloor: React.FC<RoomFloorProps> = ({ dimensions, visible }) => {
  const { width, length } = dimensions;

  return (
    <group visible={visible}>
      {/* Primary surface — solid, slightly reflective */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length, Math.ceil(width), Math.ceil(length)]} />
        <meshStandardMaterial
          color="#2c2c3e"
          roughness={0.8}
          metalness={0.1}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* Wireframe overlay — visualises structural segmentation */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
      >
        <planeGeometry args={[width, length, Math.ceil(width), Math.ceil(length)]} />
        <meshBasicMaterial color="#5a5a8a" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
};
