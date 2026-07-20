/**
 * @module hooks/useRoomGeometry
 * @description A custom hook that provides a clean abstraction boundary over
 * the raw Zustand store for the Room Geometry domain. Consumers of this hook
 * are insulated from store implementation details and receive pre-computed
 * derived metrics — avoiding scattered, duplicated computation.
 */
import { useMemo } from 'react';
import { useRoomGeometryStore } from '../store';
import type { RoomDimensions, RoomDerivedMetrics, SurfaceVisibility } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Public Interface Contract
// ─────────────────────────────────────────────────────────────────────────────

export interface UseRoomGeometryReturn {
  /** Current room dimensions (read from store). */
  dimensions: RoomDimensions;
  /** Per-surface visibility state (read from store). */
  surfaceVisibility: SurfaceVisibility;
  /**
   * Derived geometric and acoustic metrics. Memoized — recomputed only
   * when dimensions change. Never stored in the state layer.
   */
  derived: RoomDerivedMetrics;
  /** Mutates a single dimension via the store's clamped setter. */
  setDimension: (key: keyof RoomDimensions, value: number) => void;
  /** Resets all dimensions to architectural defaults. */
  resetDimensions: () => void;
  /** Toggles a single surface's visibility state. */
  toggleSurfaceVisibility: (surfaceId: keyof SurfaceVisibility) => void;
  /** Batch-sets all surfaces to visible. */
  showAllSurfaces: () => void;
  /** Batch-sets all surfaces to hidden. */
  hideAllSurfaces: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook Implementation
// ─────────────────────────────────────────────────────────────────────────────

export const useRoomGeometry = (): UseRoomGeometryReturn => {
  const {
    dimensions,
    surfaceVisibility,
    setDimension,
    resetDimensions,
    toggleSurfaceVisibility,
    showAllSurfaces,
    hideAllSurfaces,
  } = useRoomGeometryStore();

  /**
   * Derived metrics are computed via useMemo.
   * This is the single location where geometric formulas are defined —
   * pure functions with no side effects.
   */
  const derived = useMemo<RoomDerivedMetrics>(() => {
    const { width, length, height } = dimensions;
    const floorArea = width * length;
    const volume = floorArea * height;
    // Total surface area of a rectangular cuboid:
    // 2*(wl) + 2*(wh) + 2*(lh)
    const totalSurfaceArea = 2 * floorArea + 2 * (width * height) + 2 * (length * height);

    // Compute the room ratio — a key acoustic descriptor.
    // Normalised to smallest dimension = 1.
    const minDim = Math.min(height, width, length);
    const rH = +(height / minDim).toFixed(2);
    const rW = +(width / minDim).toFixed(2);
    const rL = +(length / minDim).toFixed(2);
    const roomRatio = `${rH} : ${rW} : ${rL}`;

    return { floorArea, volume, totalSurfaceArea, roomRatio };
  }, [dimensions]);

  return {
    dimensions,
    surfaceVisibility,
    derived,
    setDimension,
    resetDimensions,
    toggleSurfaceVisibility,
    showAllSurfaces,
    hideAllSurfaces,
  };
};
