/**
 * @module components/ui/RoomPlanPreview
 * @description A reactive SVG top-down floor plan preview of the room.
 * Renders in the UI panel, updating live as dimensions change.
 * This is a pure UI component — reads dimensions via the useRoomGeometry hook.
 * Zero coupling to the Visualization Layer.
 */
import React from 'react';
import type { RoomDimensions } from '../../types';

interface RoomPlanPreviewProps {
  dimensions: RoomDimensions;
}

const PREVIEW_W = 260;
const PREVIEW_H = 180;
const PADDING = 24;

export const RoomPlanPreview: React.FC<RoomPlanPreviewProps> = ({ dimensions }) => {
  const { width, length } = dimensions;

  // Scale to fit within the preview area while maintaining aspect ratio
  const availW = PREVIEW_W - PADDING * 2;
  const availH = PREVIEW_H - PADDING * 2;
  const scale = Math.min(availW / width, availH / length);
  const rectW = width * scale;
  const rectH = length * scale;

  // Centre the room rectangle within the SVG
  const offsetX = (PREVIEW_W - rectW) / 2;
  const offsetY = (PREVIEW_H - rectH) / 2;

  // Grid lines inside the room (every 1m)
  const vertLines: number[] = [];
  for (let i = 1; i < width; i++) {
    vertLines.push(offsetX + i * scale);
  }
  const horizLines: number[] = [];
  for (let i = 1; i < length; i++) {
    horizLines.push(offsetY + i * scale);
  }

  // Dimension label positions
  const widthLabelX = PREVIEW_W / 2;
  const widthLabelY = offsetY + rectH + 14;
  const lengthLabelX = offsetX + rectW + 14;
  const lengthLabelY = PREVIEW_H / 2;

  return (
    <svg
      width={PREVIEW_W}
      height={PREVIEW_H}
      viewBox={`0 0 ${PREVIEW_W} ${PREVIEW_H}`}
      aria-label="Top-down floor plan preview"
      role="img"
    >
      <defs>
        <linearGradient id="room-fill-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e2a4a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#16203a" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Room fill */}
      <rect
        x={offsetX}
        y={offsetY}
        width={rectW}
        height={rectH}
        fill="url(#room-fill-gradient)"
        rx={1}
      />

      {/* Internal grid lines */}
      {vertLines.map((x, i) => (
        <line
          key={`v-${i}`}
          x1={x} y1={offsetY}
          x2={x} y2={offsetY + rectH}
          stroke="#2a3a60"
          strokeWidth="0.5"
          strokeDasharray="3,3"
        />
      ))}
      {horizLines.map((y, i) => (
        <line
          key={`h-${i}`}
          x1={offsetX}  y1={y}
          x2={offsetX + rectW} y2={y}
          stroke="#2a3a60"
          strokeWidth="0.5"
          strokeDasharray="3,3"
        />
      ))}

      {/* Room border */}
      <rect
        x={offsetX}
        y={offsetY}
        width={rectW}
        height={rectH}
        fill="none"
        stroke="#7986cb"
        strokeWidth="2"
        rx={1}
      />

      {/* Corner accent marks */}
      {[
        [offsetX, offsetY], [offsetX + rectW, offsetY],
        [offsetX, offsetY + rectH], [offsetX + rectW, offsetY + rectH],
      ].map(([cx, cy], i) => (
        <circle key={`corner-${i}`} cx={cx} cy={cy} r="3" fill="#7986cb" />
      ))}

      {/* North indicator */}
      <text
        x={offsetX + rectW / 2}
        y={offsetY - 6}
        textAnchor="middle"
        fontSize="9"
        fill="#9fa8da"
        fontFamily="monospace"
      >N</text>

      {/* Width dimension label */}
      <line
        x1={offsetX} y1={offsetY + rectH + 6}
        x2={offsetX + rectW} y2={offsetY + rectH + 6}
        stroke="#5c6bc0" strokeWidth="0.8"
      />
      <text
        x={widthLabelX}
        y={widthLabelY}
        textAnchor="middle"
        fontSize="9"
        fill="#9fa8da"
        fontFamily="monospace"
      >{width.toFixed(1)}m</text>

      {/* Length dimension label */}
      <line
        x1={offsetX + rectW + 6} y1={offsetY}
        x2={offsetX + rectW + 6} y2={offsetY + rectH}
        stroke="#5c6bc0" strokeWidth="0.8"
      />
      <text
        x={lengthLabelX}
        y={lengthLabelY}
        textAnchor="start"
        fontSize="9"
        fill="#9fa8da"
        fontFamily="monospace"
        transform={`rotate(90, ${lengthLabelX}, ${lengthLabelY})`}
      >{length.toFixed(1)}m</text>
    </svg>
  );
};
