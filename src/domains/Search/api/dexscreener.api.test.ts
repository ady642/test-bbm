import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dexscreenerApi } from './dexscreener.api';
import type { DexScreenerResponse } from '../types';

describe('dexscreenerApi', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchPairs', () => {
    it('should return empty pairs for empty query', async () => {
      const result = await dexscreenerApi.searchPairs('');

      expect(result).toEqual({
        schemaVersion: '1.0.0',
        pairs: null,
      });
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should return empty pairs for whitespace query', async () => {
      const result = await dexscreenerApi.searchPairs('   ');

      expect(result).toEqual({
        schemaVersion: '1.0.0',
        pairs: null,
      });
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should fetch pairs successfully', async () => {
      const mockResponse: DexScreenerResponse = {
        schemaVersion: '1.0.0',
        pairs: [
          {
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
          },
        ],
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await dexscreenerApi.searchPairs('SOL');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.dexscreener.com/latest/dex/search?q=SOL'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should encode special characters in query', async () => {
      const mockResponse: DexScreenerResponse = {
        schemaVersion: '1.0.0',
        pairs: [],
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await dexscreenerApi.searchPairs('SOL/USDC');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.dexscreener.com/latest/dex/search?q=SOL%2FUSDC'
      );
    });

    it('should throw error when fetch fails', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      } as Response);

      await expect(dexscreenerApi.searchPairs('INVALID')).rejects.toThrow(
        'Failed to fetch pairs: Not Found'
      );
    });

    it('should throw error when network fails', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      await expect(dexscreenerApi.searchPairs('SOL')).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle response with null pairs', async () => {
      const mockResponse: DexScreenerResponse = {
        schemaVersion: '1.0.0',
        pairs: null,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await dexscreenerApi.searchPairs('NONEXISTENT');

      expect(result).toEqual(mockResponse);
      expect(result.pairs).toBeNull();
    });
  });
});
