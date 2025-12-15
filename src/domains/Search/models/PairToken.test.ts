import { describe, it, expect } from 'vitest';
import { PairToken } from './PairToken';
import type { DexScreenerPair } from '../types';

describe('PairToken', () => {
  const mockDexScreenerPair: DexScreenerPair = {
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
      h6: { buys: 30, sells: 20 },
    },
    volume: {
      h24: 1000000,
      h6: 250000,
    },
    priceChange: {
      h24: 5.5,
      h6: 2.3,
    },
    liquidity: {
      usd: 500000,
      base: 3000,
      quote: 450000,
    },
    fdv: 10000000,
    marketCap: 8000000,
    pairCreatedAt: 1640000000000,
    info: {
      imageUrl: 'https://example.com/image.png',
      websites: [{ url: 'https://solana.com' }],
      socials: [{ platform: 'twitter', handle: '@solana' }],
    },
  };

  describe('fromDexScreener', () => {
    it('should create a PairToken instance from DexScreener data', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);

      expect(pairToken).toBeInstanceOf(PairToken);
      expect(pairToken.chainId).toBe('solana');
      expect(pairToken.dexId).toBe('raydium');
      expect(pairToken.pairAddress).toBe('0x123');
    });

    it('should correctly map base and quote tokens', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);

      expect(pairToken.baseToken).toEqual({
        address: '0xbase',
        name: 'Solana',
        symbol: 'SOL',
      });
      expect(pairToken.quoteToken).toEqual({
        address: '0xquote',
        name: 'USD Coin',
        symbol: 'USDC',
      });
    });

    it('should correctly map price information', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);

      expect(pairToken.priceNative).toBe('1.5');
      expect(pairToken.priceUsd).toBe('150.50');
    });

    it('should handle missing optional fields', () => {
      const minimalPair: DexScreenerPair = {
        chainId: 'ethereum',
        dexId: 'uniswap',
        url: 'https://dexscreener.com/ethereum/test',
        pairAddress: '0xabc',
        baseToken: {
          address: '0xbase',
          name: 'Token',
          symbol: 'TKN',
        },
        quoteToken: {
          address: '0xquote',
          name: 'USDT',
          symbol: 'USDT',
        },
        priceNative: '1.0',
      };

      const pairToken = PairToken.fromDexScreener(minimalPair);

      expect(pairToken.priceUsd).toBeUndefined();
      expect(pairToken.liquidity).toBeUndefined();
      expect(pairToken.marketCap).toBeUndefined();
    });
  });

  describe('getters', () => {
    it('should return formatted pair name', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);
      expect(pairToken.pairName).toBe('SOL/USDC');
    });

    it('should return formatted price with USD symbol', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);
      expect(pairToken.formattedPriceUsd).toBe('$150.50');
    });

    it('should return N/A when price is not available', () => {
      const minimalPair: DexScreenerPair = {
        chainId: 'ethereum',
        dexId: 'uniswap',
        url: 'https://dexscreener.com/ethereum/test',
        pairAddress: '0xabc',
        baseToken: {
          address: '0xbase',
          name: 'Token',
          symbol: 'TKN',
        },
        quoteToken: {
          address: '0xquote',
          name: 'USDT',
          symbol: 'USDT',
        },
        priceNative: '1.0',
      };

      const pairToken = PairToken.fromDexScreener(minimalPair);
      expect(pairToken.formattedPriceUsd).toBe('N/A');
    });

    it('should return 24h volume', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);
      expect(pairToken.volume24h).toBe(1000000);
    });

    it('should return 0 when volume is not available', () => {
      const pairWithoutVolume: DexScreenerPair = {
        ...mockDexScreenerPair,
        volume: undefined,
      };

      const pairToken = PairToken.fromDexScreener(pairWithoutVolume);
      expect(pairToken.volume24h).toBe(0);
    });

    it('should return 24h price change', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);
      expect(pairToken.priceChange24h).toBe(5.5);
    });

    it('should return 0 when price change is not available', () => {
      const pairWithoutPriceChange: DexScreenerPair = {
        ...mockDexScreenerPair,
        priceChange: undefined,
      };

      const pairToken = PairToken.fromDexScreener(pairWithoutPriceChange);
      expect(pairToken.priceChange24h).toBe(0);
    });

    it('should return formatted liquidity', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);
      expect(pairToken.formattedLiquidity).toBe('$500,000');
    });

    it('should return N/A when liquidity is not available', () => {
      const pairWithoutLiquidity: DexScreenerPair = {
        ...mockDexScreenerPair,
        liquidity: undefined,
      };

      const pairToken = PairToken.fromDexScreener(pairWithoutLiquidity);
      expect(pairToken.formattedLiquidity).toBe('N/A');
    });
  });

  describe('utility methods', () => {
    it('should check if price is increasing', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);
      expect(pairToken.isPriceIncreasing()).toBe(true);
    });

    it('should check if price is decreasing', () => {
      const decreasingPair: DexScreenerPair = {
        ...mockDexScreenerPair,
        priceChange: { h24: -3.5 },
      };

      const pairToken = PairToken.fromDexScreener(decreasingPair);
      expect(pairToken.isPriceIncreasing()).toBe(false);
    });

    it('should return created date', () => {
      const pairToken = PairToken.fromDexScreener(mockDexScreenerPair);
      const createdDate = pairToken.getCreatedDate();

      expect(createdDate).toBeInstanceOf(Date);
      expect(createdDate?.getTime()).toBe(1640000000000);
    });

    it('should return null when created date is not available', () => {
      const pairWithoutCreatedAt: DexScreenerPair = {
        ...mockDexScreenerPair,
        pairCreatedAt: undefined,
      };

      const pairToken = PairToken.fromDexScreener(pairWithoutCreatedAt);
      expect(pairToken.getCreatedDate()).toBeNull();
    });
  });
});
