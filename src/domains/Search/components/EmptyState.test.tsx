import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should show initial state when hasSearched is false', () => {
    render(<EmptyState hasSearched={false} />);
    
    expect(screen.getByText(/search for trading pairs/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a token symbol or pair name/i)).toBeInTheDocument();
  });

  it('should show no results state when hasSearched is true', () => {
    render(<EmptyState hasSearched={true} />);
    
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    expect(screen.getByText(/try adjusting your search query/i)).toBeInTheDocument();
  });

  it('should render search icon', () => {
    const { container } = render(<EmptyState hasSearched={false} />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
