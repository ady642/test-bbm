import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PairCard } from './PairCard';
import { PairToken } from '../models/PairToken';
import type { DexScreenerPair } from '../types';

describe('PairCard', () => {
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

  it('should render pair name', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    render(<PairCard pair={pair} />);
    
    expect(screen.getByText('SOL/USDC')).toBeInTheDocument();
  });

  it('should render chain and dex information', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    render(<PairCard pair={pair} />);
    
    expect(screen.getByText('solana')).toBeInTheDocument();
    expect(screen.getByText('raydium')).toBeInTheDocument();
  });

  it('should render price in USD', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    render(<PairCard pair={pair} />);
    
    expect(screen.getByText('$150.50')).toBeInTheDocument();
  });

  it('should render positive price change with green color', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    const { container } = render(<PairCard pair={pair} />);
    
    expect(screen.getByText('+5.50%')).toBeInTheDocument();
    const priceChangeElement = container.querySelector('.text-green-600');
    expect(priceChangeElement).toBeInTheDocument();
  });

  it('should render negative price change with red color', () => {
    const negativePairData = {
      ...mockPairData,
      priceChange: { h24: -3.5 },
    };
    const pair = PairToken.fromDexScreener(negativePairData);
    const { container } = render(<PairCard pair={pair} />);
    
    expect(screen.getByText('-3.50%')).toBeInTheDocument();
    const priceChangeElement = container.querySelector('.text-red-600');
    expect(priceChangeElement).toBeInTheDocument();
  });

  it('should render volume', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    render(<PairCard pair={pair} />);
    
    expect(screen.getByText('$1.00M')).toBeInTheDocument();
  });

  it('should render liquidity', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    render(<PairCard pair={pair} />);
    
    expect(screen.getByText('$500,000')).toBeInTheDocument();
  });

  it('should render market cap when available', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    render(<PairCard pair={pair} />);
    
    expect(screen.getByText('$8.00M')).toBeInTheDocument();
  });

  it('should not render market cap when not available', () => {
    const pairWithoutMarketCap = {
      ...mockPairData,
      marketCap: undefined,
    };
    const pair = PairToken.fromDexScreener(pairWithoutMarketCap);
    render(<PairCard pair={pair} />);
    
    expect(screen.queryByText(/market cap/i)).not.toBeInTheDocument();
  });

  it('should render labels when available', () => {
    const pairWithLabels = {
      ...mockPairData,
      labels: ['v3', 'trending'],
    };
    const pair = PairToken.fromDexScreener(pairWithLabels);
    render(<PairCard pair={pair} />);
    
    expect(screen.getByText('v3')).toBeInTheDocument();
    expect(screen.getByText('trending')).toBeInTheDocument();
  });

  it('should have link to dexscreener', () => {
    const pair = PairToken.fromDexScreener(mockPairData);
    render(<PairCard pair={pair} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://dexscreener.com/solana/test');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
