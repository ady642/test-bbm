import type { DexScreenerResponse } from '../types';

const BASE_URL = 'https://api.dexscreener.com';

export const dexscreenerApi = {
  searchPairs: async (query: string): Promise<DexScreenerResponse> => {
    if (!query.trim()) {
      return { schemaVersion: '1.0.0', pairs: null };
    }

    const response = await fetch(
      `${BASE_URL}/latest/dex/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pairs: ${response.statusText}`);
    }

    return response.json();
  },
};

// Creer un client global pour les appels API