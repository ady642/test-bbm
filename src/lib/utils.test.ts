import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatNumber } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });

    it('should merge tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with $ symbol', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('should format large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format decimal numbers', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatNumber', () => {
    it('should format small numbers normally', () => {
      expect(formatNumber(999)).toBe('999.00');
    });

    it('should format thousands with K', () => {
      expect(formatNumber(1500)).toBe('1.50K');
    });

    it('should format millions with M', () => {
      expect(formatNumber(1500000)).toBe('1.50M');
    });

    it('should format billions with B', () => {
      expect(formatNumber(1500000000)).toBe('1.50B');
    });
  });
});
