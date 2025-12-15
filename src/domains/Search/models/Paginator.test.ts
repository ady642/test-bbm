import { describe, it, expect } from 'vitest';
import { Paginator } from './Paginator';

describe('Paginator', () => {
  const mockItems = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  describe('constructor', () => {
    it('should create a paginator with default page size', () => {
      const paginator = new Paginator(mockItems);

      expect(paginator.getCurrentPage()).toBe(1);
      expect(paginator.getPageSize()).toBe(10);
      expect(paginator.getTotalPages()).toBe(5);
      expect(paginator.getTotalItems()).toBe(50);
    });

    it('should create a paginator with custom page size', () => {
      const paginator = new Paginator(mockItems, 20);

      expect(paginator.getPageSize()).toBe(20);
      expect(paginator.getTotalPages()).toBe(3);
    });

    it('should handle empty items array', () => {
      const paginator = new Paginator([]);

      expect(paginator.getTotalPages()).toBe(0);
      expect(paginator.getTotalItems()).toBe(0);
      expect(paginator.getCurrentPageItems()).toEqual([]);
    });

    it('should handle items less than page size', () => {
      const fewItems = mockItems.slice(0, 5);
      const paginator = new Paginator(fewItems, 10);

      expect(paginator.getTotalPages()).toBe(1);
      expect(paginator.getCurrentPageItems()).toHaveLength(5);
    });
  });

  describe('getCurrentPageItems', () => {
    it('should return items for the first page', () => {
      const paginator = new Paginator(mockItems, 10);
      const items = paginator.getCurrentPageItems();

      expect(items).toHaveLength(10);
      expect(items[0].id).toBe(1);
      expect(items[9].id).toBe(10);
    });

    it('should return items for the last page', () => {
      const paginator = new Paginator(mockItems, 10);
      paginator.goToPage(5);
      const items = paginator.getCurrentPageItems();

      expect(items).toHaveLength(10);
      expect(items[0].id).toBe(41);
      expect(items[9].id).toBe(50);
    });

    it('should return partial items for incomplete last page', () => {
      const items = mockItems.slice(0, 25);
      const paginator = new Paginator(items, 10);
      paginator.goToPage(3);
      const pageItems = paginator.getCurrentPageItems();

      expect(pageItems).toHaveLength(5);
      expect(pageItems[0].id).toBe(21);
      expect(pageItems[4].id).toBe(25);
    });
  });

  describe('navigation', () => {
    it('should navigate to next page', () => {
      const paginator = new Paginator(mockItems, 10);

      expect(paginator.getCurrentPage()).toBe(1);
      paginator.nextPage();
      expect(paginator.getCurrentPage()).toBe(2);
    });

    it('should not go beyond last page', () => {
      const paginator = new Paginator(mockItems, 10);
      paginator.goToPage(5);

      expect(paginator.getCurrentPage()).toBe(5);
      paginator.nextPage();
      expect(paginator.getCurrentPage()).toBe(5);
    });

    it('should navigate to previous page', () => {
      const paginator = new Paginator(mockItems, 10);
      paginator.goToPage(3);

      expect(paginator.getCurrentPage()).toBe(3);
      paginator.previousPage();
      expect(paginator.getCurrentPage()).toBe(2);
    });

    it('should not go below first page', () => {
      const paginator = new Paginator(mockItems, 10);

      expect(paginator.getCurrentPage()).toBe(1);
      paginator.previousPage();
      expect(paginator.getCurrentPage()).toBe(1);
    });

    it('should go to specific page', () => {
      const paginator = new Paginator(mockItems, 10);

      paginator.goToPage(3);
      expect(paginator.getCurrentPage()).toBe(3);
    });

    it('should clamp page number to valid range', () => {
      const paginator = new Paginator(mockItems, 10);

      paginator.goToPage(10);
      expect(paginator.getCurrentPage()).toBe(5);

      paginator.goToPage(0);
      expect(paginator.getCurrentPage()).toBe(1);

      paginator.goToPage(-5);
      expect(paginator.getCurrentPage()).toBe(1);
    });

    it('should go to first page', () => {
      const paginator = new Paginator(mockItems, 10);
      paginator.goToPage(3);

      paginator.goToFirstPage();
      expect(paginator.getCurrentPage()).toBe(1);
    });

    it('should go to last page', () => {
      const paginator = new Paginator(mockItems, 10);

      paginator.goToLastPage();
      expect(paginator.getCurrentPage()).toBe(5);
    });
  });

  describe('goToPage', () => {
    it('should go to specific page', () => {
      const paginator = new Paginator(mockItems, 10);

      paginator.goToPage(3);
      expect(paginator.getCurrentPage()).toBe(3);
    });

    it('should not go below page 1', () => {
      const paginator = new Paginator(mockItems, 10);

      paginator.goToPage(0);
      expect(paginator.getCurrentPage()).toBe(1);

      paginator.goToPage(-5);
      expect(paginator.getCurrentPage()).toBe(1);
    });

    it('should not go above total pages', () => {
      const paginator = new Paginator(mockItems, 10);

      paginator.goToPage(100);
      expect(paginator.getCurrentPage()).toBe(5);
    });

    it('should handle goToPage with empty items', () => {
      const paginator = new Paginator([], 10);

      paginator.goToPage(5);
      expect(paginator.getCurrentPage()).toBe(1);
    });
  });

  describe('state checks', () => {
    it('should check if has next page', () => {
      const paginator = new Paginator(mockItems, 10);

      expect(paginator.hasNextPage()).toBe(true);

      paginator.goToLastPage();
      expect(paginator.hasNextPage()).toBe(false);
    });

    it('should check if has previous page', () => {
      const paginator = new Paginator(mockItems, 10);

      expect(paginator.hasPreviousPage()).toBe(false);

      paginator.nextPage();
      expect(paginator.hasPreviousPage()).toBe(true);
    });

    it('should check if on first page', () => {
      const paginator = new Paginator(mockItems, 10);

      expect(paginator.isFirstPage()).toBe(true);

      paginator.nextPage();
      expect(paginator.isFirstPage()).toBe(false);
    });

    it('should check if on last page', () => {
      const paginator = new Paginator(mockItems, 10);

      expect(paginator.isLastPage()).toBe(false);

      paginator.goToLastPage();
      expect(paginator.isLastPage()).toBe(true);
    });
  });

  describe('updateItems', () => {
    it('should update items and reset to first page', () => {
      const paginator = new Paginator(mockItems, 10);
      paginator.goToPage(3);

      const newItems = mockItems.slice(0, 20);
      paginator.updateItems(newItems);

      expect(paginator.getCurrentPage()).toBe(1);
      expect(paginator.getTotalItems()).toBe(20);
      expect(paginator.getTotalPages()).toBe(2);
    });

    it('should handle updating to empty items', () => {
      const paginator = new Paginator(mockItems, 10);

      paginator.updateItems([]);

      expect(paginator.getTotalItems()).toBe(0);
      expect(paginator.getTotalPages()).toBe(0);
      expect(paginator.getCurrentPageItems()).toEqual([]);
    });
  });

  describe('getPageRange', () => {
    it('should return correct range for first page', () => {
      const paginator = new Paginator(mockItems, 10);

      const range = paginator.getPageRange();
      expect(range).toEqual({ start: 1, end: 10 });
    });

    it('should return correct range for middle page', () => {
      const paginator = new Paginator(mockItems, 10);
      paginator.goToPage(3);

      const range = paginator.getPageRange();
      expect(range).toEqual({ start: 21, end: 30 });
    });

    it('should return correct range for last page', () => {
      const paginator = new Paginator(mockItems, 10);
      paginator.goToLastPage();

      const range = paginator.getPageRange();
      expect(range).toEqual({ start: 41, end: 50 });
    });

    it('should return 0,0 range for empty items', () => {
      const paginator = new Paginator([], 10);

      const range = paginator.getPageRange();
      expect(range).toEqual({ start: 0, end: 0 });
    });

    it('should return correct range for partial last page', () => {
      const items = mockItems.slice(0, 25);
      const paginator = new Paginator(items, 10);
      paginator.goToLastPage();
      const range = paginator.getPageRange();

      expect(range).toEqual({ start: 21, end: 25 });
    });
  });
});
