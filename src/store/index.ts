/**
 * @module store
 * @description Centralized Zustand state layer. Decouples the Core UI Layer
 * from the Visualization Layer via explicit, typed store slices.
 *
 * Architectural Rule: UI components and 3D canvas components may ONLY
 * communicate through this store. No direct prop-drilling between layers.
 */
import { create } from 'zustand';
import type { RoomDimensions, SurfaceVisibility } from '../types';
import {
  DEFAULT_ROOM_DIMENSIONS,
  DEFAULT_SURFACE_VISIBILITY,
  DIMENSION_CONSTRAINTS,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Slice 1: Application State
// ─────────────────────────────────────────────────────────────────────────────

interface AppState {
  isVisualizationReady: boolean;
  setVisualizationReady: (ready: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isVisualizationReady: false,
  setVisualizationReady: (ready) => set({ isVisualizationReady: ready }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Slice 2: Room Geometry State
// ─────────────────────────────────────────────────────────────────────────────

interface RoomGeometryState {
  /** The current room dimensions. Clamped to DIMENSION_CONSTRAINTS on write. */
  dimensions: RoomDimensions;
  /** Per-surface visibility toggle state. */
  surfaceVisibility: SurfaceVisibility;

  /**
   * Updates a single dimension key with automatic constraint clamping.
   * The store enforces valid ranges — UI need not duplicate validation.
   */
  setDimension: (key: keyof RoomDimensions, value: number) => void;

  /** Resets all dimensions to their architectural defaults. */
  resetDimensions: () => void;

  /** Toggles a single surface between visible and hidden. */
  toggleSurfaceVisibility: (surfaceId: RoomSurfaceId) => void;

  /** Sets all surfaces to visible. */
  showAllSurfaces: () => void;

  /** Sets all surfaces to hidden. */
  hideAllSurfaces: () => void;
}

type RoomSurfaceId = keyof SurfaceVisibility;

export const useRoomGeometryStore = create<RoomGeometryState>((set) => ({
  dimensions: DEFAULT_ROOM_DIMENSIONS,
  surfaceVisibility: DEFAULT_SURFACE_VISIBILITY,

  setDimension: (key, value) => {
    const constraints = DIMENSION_CONSTRAINTS[key];
    const clamped = Math.min(
      constraints.max,
      Math.max(constraints.min, value)
    );
    set((state) => ({
      dimensions: { ...state.dimensions, [key]: clamped },
    }));
  },

  resetDimensions: () =>
    set({ dimensions: DEFAULT_ROOM_DIMENSIONS }),

  toggleSurfaceVisibility: (surfaceId) =>
    set((state) => ({
      surfaceVisibility: {
        ...state.surfaceVisibility,
        [surfaceId]: !state.surfaceVisibility[surfaceId],
      },
    })),

  showAllSurfaces: () =>
    set({ surfaceVisibility: DEFAULT_SURFACE_VISIBILITY }),

  hideAllSurfaces: () =>
    set({
      surfaceVisibility: Object.fromEntries(
        Object.keys(DEFAULT_SURFACE_VISIBILITY).map((k) => [k, false])
      ) as SurfaceVisibility,
    }),
}));
