import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store';

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.setState({ isVisualizationReady: false });
  });

  it('should have initial state isVisualizationReady as false', () => {
    expect(useAppStore.getState().isVisualizationReady).toBe(false);
  });

  it('should update isVisualizationReady when setVisualizationReady is called', () => {
    useAppStore.getState().setVisualizationReady(true);
    expect(useAppStore.getState().isVisualizationReady).toBe(true);

    useAppStore.getState().setVisualizationReady(false);
    expect(useAppStore.getState().isVisualizationReady).toBe(false);
  });
});
