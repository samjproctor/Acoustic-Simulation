import React, { Component, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in 3D Visualization Layer:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }
      return (
        <div style={{ padding: '2rem', color: 'red', backgroundColor: '#fdd', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Visualization Layer Error</h2>
          <p>{this.state.error?.message || 'An unknown error occurred rendering the 3D scene.'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
