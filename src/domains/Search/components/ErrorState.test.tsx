import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  const mockError = new Error('Failed to fetch data');

  it('should render error message', () => {
    render(<ErrorState error={mockError} />);
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorState error={mockError} onRetry={onRetry} />);
    
    const retryButton = screen.getByText(/try again/i);
    expect(retryButton).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState error={mockError} onRetry={onRetry} />);
    
    const retryButton = screen.getByText(/try again/i);
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState error={mockError} />);
    
    expect(screen.queryByText(/try again/i)).not.toBeInTheDocument();
  });

  it('should render error icon', () => {
    const { container } = render(<ErrorState error={mockError} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should show default message when error message is empty', () => {
    const emptyError = new Error('');
    render(<ErrorState error={emptyError} />);
    
    expect(screen.getByText(/failed to fetch trading pairs/i)).toBeInTheDocument();
  });
});
