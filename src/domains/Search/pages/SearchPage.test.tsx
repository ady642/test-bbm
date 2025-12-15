import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SearchPage } from './SearchPage';
import { useSearchStore } from '../store/searchStore';
import * as dexscreenerApi from '../api/dexscreener.api';
import type { DexScreenerResponse } from '../types';

vi.mock('../api/dexscreener.api');

const createMockPair = (index: number) => ({
  chainId: 'solana',
  dexId: 'raydium',
  url: `https://dexscreener.com/solana/test${index}`,
  pairAddress: `0x${index}`,
  baseToken: {
    address: `0xbase${index}`,
    name: 'Solana',
    symbol: 'SOL',
  },
  quoteToken: {
    address: `0xquote${index}`,
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
});

const mockSearchResponse: DexScreenerResponse = {
  schemaVersion: '1.0.0',
  pairs: [createMockPair(1), createMockPair(2)],
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};

describe('SearchPage', () => {
  beforeEach(() => {
    useSearchStore.setState({
      searchQuery: '',
      pairs: [],
      paginator: useSearchStore.getState().paginator,
    });
  });

  it('should render search page with initial state', () => {
    render(<SearchPage />, { wrapper: createWrapper() });

    expect(screen.getByPlaceholderText(/search for pairs/i)).toBeTruthy();
    expect(screen.getByText(/DEX Pair Explorer/i)).toBeTruthy();
  });

  it('should perform search and update store', async () => {
    vi.mocked(dexscreenerApi.dexscreenerApi.searchPairs).mockResolvedValue(
      mockSearchResponse
    );

    render(<SearchPage />, { wrapper: createWrapper() });

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search for pairs/i);

    await user.type(searchInput, 'SOL');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(useSearchStore.getState().pairs.length).toBe(2);
    });
  });

  it('should show empty results state when no pairs found', async () => {
    vi.mocked(dexscreenerApi.dexscreenerApi.searchPairs).mockResolvedValue({
      schemaVersion: '1.0.0',
      pairs: null,
    });

    render(<SearchPage />, { wrapper: createWrapper() });

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search for pairs/i);

    await user.type(searchInput, 'NONEXISTENT');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeTruthy();
    });
  });

  it('should pass correct props to Pagination component', async () => {
    const largeMockResponse = {
      ...mockSearchResponse,
      pairs: Array.from({ length: 25 }, (_, i) => createMockPair(i + 1)),
    };
    
    vi.mocked(dexscreenerApi.dexscreenerApi.searchPairs).mockResolvedValue(
      largeMockResponse
    );

    render(<SearchPage />, { wrapper: createWrapper() });

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search for pairs/i);

    await user.type(searchInput, 'SOL');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(useSearchStore.getState().pairs.length).toBe(25);
    });

    expect(screen.getByText(/showing/i)).toBeTruthy();
    expect(screen.getByLabelText(/next/i)).toBeTruthy();
    expect(screen.getByLabelText(/previous/i)).toBeTruthy();
  });

  it('should display pair cards when results exist', async () => {
    vi.mocked(dexscreenerApi.dexscreenerApi.searchPairs).mockResolvedValue(
      mockSearchResponse
    );

    render(<SearchPage />, { wrapper: createWrapper() });

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText(/search for pairs/i);

    await user.type(searchInput, 'SOL');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(useSearchStore.getState().pairs.length).toBeGreaterThan(0);
    });

    const pairCards = screen.getAllByText(/SOL/);
    expect(pairCards.length).toBeGreaterThan(0);
  });
});
