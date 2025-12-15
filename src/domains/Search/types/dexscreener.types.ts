export interface DexScreenerToken {
  address: string;
  name: string;
  symbol: string;
}

export interface DexScreenerTxns {
  [key: string]: {
    buys: number;
    sells: number;
  };
}

export interface DexScreenerVolume {
  [key: string]: number;
}

export interface DexScreenerPriceChange {
  [key: string]: number;
}

export interface DexScreenerLiquidity {
  usd?: number;
  base?: number;
  quote?: number;
}

export interface DexScreenerWebsite {
  url: string;
}

export interface DexScreenerSocial {
  platform: string;
  handle: string;
}

export interface DexScreenerInfo {
  imageUrl?: string;
  websites?: DexScreenerWebsite[];
  socials?: DexScreenerSocial[];
}

export interface DexScreenerBoosts {
  active?: number;
}

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels?: string[];
  baseToken: DexScreenerToken;
  quoteToken: DexScreenerToken;
  priceNative: string;
  priceUsd?: string;
  txns?: DexScreenerTxns;
  volume?: DexScreenerVolume;
  priceChange?: DexScreenerPriceChange;
  liquidity?: DexScreenerLiquidity;
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: DexScreenerInfo;
  boosts?: DexScreenerBoosts;
}

export interface DexScreenerResponse {
  schemaVersion: string;
  pairs: DexScreenerPair[] | null;
}
