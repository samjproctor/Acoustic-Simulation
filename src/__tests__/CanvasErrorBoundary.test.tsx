import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanvasErrorBoundary } from '../components/canvas/CanvasErrorBoundary';

// A component that always throws an error
const BuggyComponent = () => {
  throw new Error('Test Error from BuggyComponent');
};

describe('CanvasErrorBoundary', () => {
  let consoleErrorMock: any;

  beforeEach(() => {
    // Suppress console.error output during the test as error boundaries intentionally log them
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <CanvasErrorBoundary>
        <div data-testid="safe-child">Safe Child</div>
      </CanvasErrorBoundary>
    );

    expect(screen.getByTestId('safe-child')).toBeInTheDocument();
  });

  it('should render the default error UI when an error is caught and no fallback is provided', () => {
    render(
      <CanvasErrorBoundary>
        <BuggyComponent />
      </CanvasErrorBoundary>
    );

    expect(screen.getByText('Visualization Layer Error')).toBeInTheDocument();
    expect(screen.getByText('Test Error from BuggyComponent')).toBeInTheDocument();
    expect(consoleErrorMock).toHaveBeenCalled();
  });

  it('should render the provided fallback when an error is caught', () => {
    render(
      <CanvasErrorBoundary fallback={<div data-testid="custom-fallback">Custom Fallback</div>}>
        <BuggyComponent />
      </CanvasErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByText('Visualization Layer Error')).not.toBeInTheDocument();
  });
});
