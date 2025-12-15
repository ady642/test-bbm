import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onFirst: vi.fn(),
    onLast: vi.fn(),
    hasNext: true,
    hasPrevious: false,
    pageRange: { start: 1, end: 10 },
    totalItems: 50,
  };

  it('should render page information', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText(/showing 1 to 10 of 50 results/i)).toBeInTheDocument();
  });

  it('should render page numbers', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    
    const currentPageButton = screen.getByText('2').closest('button');
    expect(currentPageButton).toHaveClass('bg-primary');
  });

  it('should call onNext when next button is clicked', () => {
    const onNext = vi.fn();
    render(<Pagination {...defaultProps} onNext={onNext} />);
    
    const nextButton = screen.getByLabelText(/next/i);
    fireEvent.click(nextButton);
    
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('should call onPrevious when previous button is clicked', () => {
    const onPrevious = vi.fn();
    render(<Pagination {...defaultProps} currentPage={2} hasPrevious={true} onPrevious={onPrevious} />);
    
    const previousButton = screen.getByLabelText(/previous/i);
    fireEvent.click(previousButton);
    
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onFirst when first button is clicked', () => {
    const onFirst = vi.fn();
    render(<Pagination {...defaultProps} currentPage={3} hasPrevious={true} onFirst={onFirst} />);
    
    const firstButton = screen.getByLabelText(/first/i);
    fireEvent.click(firstButton);
    
    expect(onFirst).toHaveBeenCalledTimes(1);
  });

  it('should call onLast when last button is clicked', () => {
    const onLast = vi.fn();
    render(<Pagination {...defaultProps} onLast={onLast} />);
    
    const lastButton = screen.getByLabelText(/last/i);
    fireEvent.click(lastButton);
    
    expect(onLast).toHaveBeenCalledTimes(1);
  });

  it('should call onPageChange when page number is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
    
    const pageButton = screen.getByText('3');
    fireEvent.click(pageButton);
    
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should disable previous buttons when on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} hasPrevious={false} />);
    
    const previousButton = screen.getByLabelText(/previous/i);
    const firstButton = screen.getByLabelText(/first/i);
    
    expect(previousButton).toBeDisabled();
    expect(firstButton).toBeDisabled();
  });

  it('should disable next buttons when on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} hasNext={false} />);
    
    const nextButton = screen.getByLabelText(/next/i);
    const lastButton = screen.getByLabelText(/last/i);
    
    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  it('should show ellipsis for large page counts', () => {
    render(<Pagination {...defaultProps} totalPages={20} currentPage={10} />);
    
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('should show correct pagination for early pages', () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={2} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should show correct pagination for late pages', () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={9} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should not render when totalPages is 0', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={0} />);
    
    expect(container.firstChild).toBeNull();
  });
});
