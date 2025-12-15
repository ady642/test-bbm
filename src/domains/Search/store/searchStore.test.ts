import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from './searchStore';
import { PairToken } from '../models/PairToken';
import type { DexScreenerPair } from '../types';

describe('searchStore', () => {
  const mockPairData: DexScreenerPair = {
    chainId: 'solana',
    dexId: 'raydium',
    url: 'https://dexscreener.com/solana/test',
    pairAddress: '0x123',
    baseToken: {
      address: '0xbase',
      name: 'Solana',
      symbol: 'SOL',
    },
    quoteToken: {
      address: '0xquote',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    priceNative: '1.5',
    priceUsd: '150.50',
    txns: {
      h24: { buys: 100, sells: 50 },
    },
    volume: {
      h24: 1000000,
    },
    priceChange: {
      h24: 5.5,
    },
    liquidity: {
      usd: 500000,
    },
    marketCap: 8000000,
  };

  beforeEach(() => {
    useSearchStore.setState({
      searchQuery: '',
      filters: {},
      pairs: [],
      paginator: useSearchStore.getState().paginator,
    });
  });

  describe('initial state', () => {
    it('should have empty search query', () => {
      const state = useSearchStore.getState();
      expect(state.searchQuery).toBe('');
    });

    it('should have empty filters', () => {
      const state = useSearchStore.getState();
      expect(state.filters).toEqual({});
    });

    it('should have empty pairs array', () => {
      const state = useSearchStore.getState();
      expect(state.pairs).toEqual([]);
    });

    it('should have paginator initialized', () => {
      const state = useSearchStore.getState();
      expect(state.paginator).toBeDefined();
      expect(state.paginator.getCurrentPage()).toBe(1);
      expect(state.paginator.getPageSize()).toBe(12);
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      const { setSearchQuery } = useSearchStore.getState();
      
      setSearchQuery('SOL/USDC');
      
      const state = useSearchStore.getState();
      expect(state.searchQuery).toBe('SOL/USDC');
    });

    it('should handle empty query', () => {
      const { setSearchQuery } = useSearchStore.getState();
      
      setSearchQuery('test');
      setSearchQuery('');
      
      const state = useSearchStore.getState();
      expect(state.searchQuery).toBe('');
    });
  });

  describe('setFilters', () => {
    it('should update filters', () => {
      const { setFilters } = useSearchStore.getState();
      const filters = {
        minLiquidity: 100000,
        minVolume: 50000,
        chainId: 'solana',
      };
      
      setFilters(filters);
      
      const state = useSearchStore.getState();
      expect(state.filters).toEqual(filters);
    });

    it('should replace existing filters', () => {
      const { setFilters } = useSearchStore.getState();
      
      setFilters({ minLiquidity: 100000 });
      setFilters({ minVolume: 50000 });
      
      const state = useSearchStore.getState();
      expect(state.filters).toEqual({ minVolume: 50000 });
    });
  });

  describe('resetFilters', () => {
    it('should reset filters to empty object', () => {
      const { setFilters, resetFilters } = useSearchStore.getState();
      
      setFilters({
        minLiquidity: 100000,
        minVolume: 50000,
        chainId: 'solana',
      });
      resetFilters();
      
      const state = useSearchStore.getState();
      expect(state.filters).toEqual({});
    });
  });

  describe('setPairs', () => {
    it('should update pairs and create new paginator', () => {
      const { setPairs } = useSearchStore.getState();
      const pairs = [
        PairToken.fromDexScreener(mockPairData),
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: '0x456' }),
      ];
      
      setPairs(pairs);
      
      const state = useSearchStore.getState();
      expect(state.pairs).toHaveLength(2);
      expect(state.paginator.getTotalItems()).toBe(2);
    });

    it('should reset to first page when setting new pairs', () => {
      const { setPairs, goToPage } = useSearchStore.getState();
      const pairs = Array.from({ length: 25 }, (_, i) =>
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: `0x${i}` })
      );
      
      setPairs(pairs);
      goToPage(2);
      
      const newPairs = Array.from({ length: 10 }, (_, i) =>
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: `0xnew${i}` })
      );
      setPairs(newPairs);
      
      const state = useSearchStore.getState();
      expect(state.paginator.getCurrentPage()).toBe(1);
    });

    it('should handle empty pairs array', () => {
      const { setPairs } = useSearchStore.getState();
      
      setPairs([]);
      
      const state = useSearchStore.getState();
      expect(state.pairs).toEqual([]);
      expect(state.paginator.getTotalItems()).toBe(0);
    });
  });

  describe('pagination', () => {
    beforeEach(() => {
      const { setPairs } = useSearchStore.getState();
      const pairs = Array.from({ length: 25 }, (_, i) =>
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: `0x${i}` })
      );
      setPairs(pairs);
    });

    it('should navigate to next page', () => {
      const { nextPage } = useSearchStore.getState();
      
      nextPage();
      
      const state = useSearchStore.getState();
      expect(state.paginator.getCurrentPage()).toBe(2);
    });

    it('should not go beyond last page', () => {
      const { goToPage, nextPage } = useSearchStore.getState();
      
      goToPage(3);
      nextPage();
      
      const state = useSearchStore.getState();
      expect(state.paginator.getCurrentPage()).toBe(3);
    });

    it('should navigate to previous page', () => {
      const { goToPage, previousPage } = useSearchStore.getState();
      
      goToPage(2);
      previousPage();
      
      const state = useSearchStore.getState();
      expect(state.paginator.getCurrentPage()).toBe(1);
    });

    it('should not go below first page', () => {
      const { previousPage } = useSearchStore.getState();
      
      previousPage();
      
      const state = useSearchStore.getState();
      expect(state.paginator.getCurrentPage()).toBe(1);
    });

    it('should go to specific page', () => {
      const { goToPage } = useSearchStore.getState();
      
      goToPage(2);
      
      const state = useSearchStore.getState();
      expect(state.paginator.getCurrentPage()).toBe(2);
    });

    it('should clamp page number to valid range', () => {
      const { goToPage } = useSearchStore.getState();
      
      goToPage(10);
      
      const state = useSearchStore.getState();
      expect(state.paginator.getCurrentPage()).toBe(3);
    });
  });

  describe('paginator integration', () => {
    it('should return correct items for current page', () => {
      const { setPairs } = useSearchStore.getState();
      const pairs = Array.from({ length: 25 }, (_, i) =>
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: `0x${i}` })
      );
      
      setPairs(pairs);
      
      const state = useSearchStore.getState();
      const currentPageItems = state.paginator.getCurrentPageItems();
      
      expect(currentPageItems).toHaveLength(12);
      expect(currentPageItems[0].pairAddress).toBe('0x0');
      expect(currentPageItems[11].pairAddress).toBe('0x11');
    });

    it('should update items when navigating pages', () => {
      const { setPairs, goToPage } = useSearchStore.getState();
      const pairs = Array.from({ length: 25 }, (_, i) =>
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: `0x${i}` })
      );
      
      setPairs(pairs);
      goToPage(2);
      
      const state = useSearchStore.getState();
      const currentPageItems = state.paginator.getCurrentPageItems();
      
      expect(currentPageItems).toHaveLength(12);
      expect(currentPageItems[0].pairAddress).toBe('0x12');
    });

    it('should calculate total pages correctly', () => {
      const { setPairs } = useSearchStore.getState();
      const pairs = Array.from({ length: 25 }, (_, i) =>
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: `0x${i}` })
      );
      
      setPairs(pairs);
      
      const state = useSearchStore.getState();
      expect(state.paginator.getTotalPages()).toBe(3);
    });

    it('should provide correct page range', () => {
      const { setPairs, goToPage } = useSearchStore.getState();
      const pairs = Array.from({ length: 25 }, (_, i) =>
        PairToken.fromDexScreener({ ...mockPairData, pairAddress: `0x${i}` })
      );
      
      setPairs(pairs);
      goToPage(2);
      
      const state = useSearchStore.getState();
      const range = state.paginator.getPageRange();
      
      expect(range).toEqual({ start: 13, end: 24 });
    });
  });

  describe('store subscription', () => {
    it('should notify subscribers on state change', () => {
      let callCount = 0;
      const unsubscribe = useSearchStore.subscribe(() => {
        callCount++;
      });
      
      const { setSearchQuery } = useSearchStore.getState();
      setSearchQuery('test');
      
      expect(callCount).toBeGreaterThan(0);
      unsubscribe();
    });

    it('should allow multiple subscribers', () => {
      let count1 = 0;
      let count2 = 0;
      
      const unsub1 = useSearchStore.subscribe(() => {
        count1++;
      });
      const unsub2 = useSearchStore.subscribe(() => {
        count2++;
      });
      
      const { setSearchQuery } = useSearchStore.getState();
      setSearchQuery('test');
      
      expect(count1).toBeGreaterThan(0);
      expect(count2).toBeGreaterThan(0);
      
      unsub1();
      unsub2();
    });
  });
});
