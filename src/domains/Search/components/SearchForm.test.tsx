import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from './SearchForm';

describe('SearchForm', () => {
  it('should render search input', () => {
    render(<SearchForm onSearch={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/search for pairs/i);
    expect(input).toBeInTheDocument();
  });

  it('should call onSearch with query when form is submitted', async () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText(/search for pairs/i);
    const user = userEvent.setup();
    
    await user.type(input, 'SOL/USDC');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('SOL/USDC');
    });
  });

  it('should show validation error when query is too short', async () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText(/search for pairs/i);
    const user = userEvent.setup();
    
    await user.type(input, 'A');
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument();
    });
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('should show validation error when query is empty', async () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText(/search for pairs/i);
    const user = userEvent.setup();
    
    await user.click(input);
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText(/search query is required/i)).toBeInTheDocument();
    });
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('should disable input when loading', () => {
    render(<SearchForm onSearch={vi.fn()} isLoading={true} />);
    
    const input = screen.getByPlaceholderText(/search for pairs/i);
    expect(input).toBeDisabled();
  });

  it('should not disable input when not loading', () => {
    render(<SearchForm onSearch={vi.fn()} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/search for pairs/i);
    expect(input).not.toBeDisabled();
  });
});
