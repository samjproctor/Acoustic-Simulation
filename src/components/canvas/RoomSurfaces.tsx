/**
 * @module components/canvas/RoomSurfaces
 * @description Composite 3D canvas component. Acts as the primary orchestrator
 * of all six room structural surfaces: floor, ceiling, and four walls.
 *
 * This is the ONLY canvas component that accesses the Zustand store.
 * All atomic surface components below it receive props — enabling strict
 * isolation and independent testability of each surface primitive.
 *
 * Coordinate Convention:
 *  - X-axis: left (−) to right (+), width
 *  - Y-axis: bottom (0) to top (height), height
 *  - Z-axis: front (+) to back (−), length
 *  - Room is centred at origin on the X/Z axes.
 *
 * Wall naming follows compass directions relative to the −Z axis being "north":
 *  - North: back face, z = −halfLength
 *  - South: front face, z = +halfLength
 *  - East:  right face, x = +halfWidth
 *  - West:  left face,  x = −halfWidth
 */
import React from 'react';
import { RoomFloor } from './RoomFloor';
import { RoomCeiling } from './RoomCeiling';
import { RoomWall } from './RoomWall';
import { useRoomGeometryStore } from '../../store';

const WALL_OPACITY = 0.45;

// Wall color palette — slight hue variation for directional differentiation
const WALL_COLORS = {
  northSouth: '#162440',
  eastWest:   '#162040',
} as const;

export const RoomSurfaces: React.FC = () => {
  const { dimensions, surfaceVisibility } = useRoomGeometryStore();
  const { width, length, height } = dimensions;

  const halfWidth  = width  / 2;
  const halfLength = length / 2;
  const halfHeight = height / 2;

  return (
    <group name="room-surfaces">
      {/* ── Horizontal Surfaces ─────────────────────────────────── */}
      <RoomFloor
        dimensions={dimensions}
        visible={surfaceVisibility['floor']}
      />
      <RoomCeiling
        dimensions={dimensions}
        visible={surfaceVisibility['ceiling']}
      />

      {/* ── Vertical Surfaces (Walls) ────────────────────────────── */}

      {/* North Wall — back face, normal pointing +Z into room */}
      <RoomWall
        planeWidth={width}
        planeHeight={height}
        position={[0, halfHeight, -halfLength]}
        rotation={[0, 0, 0]}
        color={WALL_COLORS.northSouth}
        opacity={WALL_OPACITY}
        visible={surfaceVisibility['wall-north']}
      />

      {/* South Wall — front face, normal pointing −Z into room */}
      <RoomWall
        planeWidth={width}
        planeHeight={height}
        position={[0, halfHeight, halfLength]}
        rotation={[0, Math.PI, 0]}
        color={WALL_COLORS.northSouth}
        opacity={WALL_OPACITY}
        visible={surfaceVisibility['wall-south']}
      />

      {/* East Wall — right face, normal pointing −X into room */}
      <RoomWall
        planeWidth={length}
        planeHeight={height}
        position={[halfWidth, halfHeight, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        color={WALL_COLORS.eastWest}
        opacity={WALL_OPACITY}
        visible={surfaceVisibility['wall-east']}
      />

      {/* West Wall — left face, normal pointing +X into room */}
      <RoomWall
        planeWidth={length}
        planeHeight={height}
        position={[-halfWidth, halfHeight, 0]}
        rotation={[0, Math.PI / 2, 0]}
        color={WALL_COLORS.eastWest}
        opacity={WALL_OPACITY}
        visible={surfaceVisibility['wall-west']}
      />
    </group>
  );
};
