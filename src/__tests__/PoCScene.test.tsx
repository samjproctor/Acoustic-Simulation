import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PoCScene } from '../components/canvas/PoCScene';

// Mock react-three-fiber and drei to prevent WebGL context errors in JSDOM
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
}));

// Provide basic stubs for intrinsic Three elements so React doesn't complain
// Since React 19, custom elements that are unrecognized might warn, but let's test if it renders.
describe('PoCScene', () => {
  it('should render the Three.js scene primitives and controls', () => {
    const { container, getByTestId } = render(<PoCScene />);
    
    // We expect the OrbitControls mock to be present
    expect(getByTestId('orbit-controls')).toBeInTheDocument();

    // In a React testing library environment, lower-case elements like <mesh> are rendered as DOM nodes.
    // Let's verify the DOM structure roughly matches the expected primitives.
    const meshElement = container.querySelector('mesh');
    expect(meshElement).toBeInTheDocument();

    const boxGeometry = container.querySelector('boxgeometry');
    expect(boxGeometry).toBeInTheDocument();

    const material = container.querySelector('meshstandardmaterial');
    expect(material).toBeInTheDocument();
  });
});
