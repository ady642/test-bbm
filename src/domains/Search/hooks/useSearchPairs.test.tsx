import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchPairs } from './useSearchPairs';
import { dexscreenerApi } from '../api/dexscreener.api';
import type { ReactNode } from 'react';

vi.mock('../api/dexscreener.api', () => ({
  dexscreenerApi: {
    searchPairs: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useSearchPairs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return data when search is successful', async () => {
    const mockResponse = {
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

    vi.mocked(dexscreenerApi.searchPairs).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSearchPairs('SOL'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
  });

  it('should not fetch when query is empty', () => {
    const { result } = renderHook(() => useSearchPairs(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
