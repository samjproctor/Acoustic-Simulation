/**
 * @module types
 * @description Shared TypeScript type contracts for all application layers.
 * All inter-layer data shapes are defined here first.
 * No layer may create implicit contracts by bypassing this module.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Room Geometry Domain Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents the physical dimensions of a rectangular, shoebox-shaped room.
 * All measurements are in meters.
 * - width  → X-axis extent
 * - length → Z-axis extent
 * - height → Y-axis extent
 */
export interface RoomDimensions {
  readonly width: number;
  readonly length: number;
  readonly height: number;
}

/**
 * Canonical identifier for each of the six structural surfaces of a room.
 * Named by their orientation in world space to prevent confusion.
 */
export type RoomSurfaceId =
  | 'floor'
  | 'ceiling'
  | 'wall-north'
  | 'wall-south'
  | 'wall-east'
  | 'wall-west';

/**
 * A record mapping each structural surface to its boolean visibility state.
 * This acts as the single source of truth for surface render toggling.
 */
export type SurfaceVisibility = Record<RoomSurfaceId, boolean>;

/**
 * Derived, read-only acoustic and geometric metrics computed from RoomDimensions.
 * These are never stored; they are computed by the useRoomGeometry hook.
 */
export interface RoomDerivedMetrics {
  readonly floorArea: number;
  readonly volume: number;
  readonly totalSurfaceArea: number;
  /**
   * The Room Ratio (Width:Length:Height) expressed as a string.
   * Critical for identifying modal frequency distribution in acoustic analysis.
   */
  readonly roomRatio: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constraint Definitions
// ─────────────────────────────────────────────────────────────────────────────

/** Input validation constraints for a single numeric dimension. */
export interface DimensionConstraints {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly unit: string;
}

/** Constraint map keyed by dimension name — drives both validation and UI rendering. */
export const DIMENSION_CONSTRAINTS: Record<keyof RoomDimensions, DimensionConstraints> = {
  width:  { min: 1,   max: 50, step: 0.5, unit: 'm' },
  length: { min: 1,   max: 50, step: 0.5, unit: 'm' },
  height: { min: 1.5, max: 20, step: 0.1, unit: 'm' },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Domain Defaults
// ─────────────────────────────────────────────────────────────────────────────

/** Default room configuration representing a standard studio control room. */
export const DEFAULT_ROOM_DIMENSIONS: RoomDimensions = {
  width: 10,
  length: 8,
  height: 3,
} as const;

/** All surfaces are visible by default upon initialisation. */
export const DEFAULT_SURFACE_VISIBILITY: SurfaceVisibility = {
  floor: true,
  ceiling: true,
  'wall-north': true,
  'wall-south': true,
  'wall-east': true,
  'wall-west': true,
} as const;

/** Ordered surface list with human-readable labels for UI rendering. */
export const ROOM_SURFACE_LABELS: Array<{ id: RoomSurfaceId; label: string; icon: string }> = [
  { id: 'floor',      label: 'Floor',      icon: '⬇' },
  { id: 'ceiling',    label: 'Ceiling',    icon: '⬆' },
  { id: 'wall-north', label: 'Wall North', icon: '◻' },
  { id: 'wall-south', label: 'Wall South', icon: '◻' },
  { id: 'wall-east',  label: 'Wall East',  icon: '◻' },
  { id: 'wall-west',  label: 'Wall West',  icon: '◻' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Re-export: App-Level State (preserved from prior architectural phase)
// ─────────────────────────────────────────────────────────────────────────────

/** General application readiness signal. */
export interface AppReadinessState {
  isVisualizationReady: boolean;
}
