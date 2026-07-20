/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Overlay } from './Overlay';

describe('Overlay Component', () => {
  it('renders title and description correctly', () => {
    render(<Overlay title="Test Title" description="Test Description" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});
