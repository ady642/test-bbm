import type { DexScreenerPair, DexScreenerToken } from '../types';

export class PairToken {
  readonly chainId: string;
  readonly dexId: string;
  readonly url: string;
  readonly pairAddress: string;
  readonly labels?: string[];
  readonly baseToken: DexScreenerToken;
  readonly quoteToken: DexScreenerToken;
  readonly priceNative: string;
  readonly priceUsd?: string;
  readonly txns?: DexScreenerPair['txns'];
  readonly volume?: DexScreenerPair['volume'];
  readonly priceChange?: DexScreenerPair['priceChange'];
  readonly liquidity?: DexScreenerPair['liquidity'];
  readonly fdv?: number;
  readonly marketCap?: number;
  readonly pairCreatedAt?: number;
  readonly info?: DexScreenerPair['info'];
  readonly boosts?: DexScreenerPair['boosts'];

  private constructor(data: DexScreenerPair) {
    this.chainId = data.chainId;
    this.dexId = data.dexId;
    this.url = data.url;
    this.pairAddress = data.pairAddress;
    this.labels = data.labels;
    this.baseToken = data.baseToken;
    this.quoteToken = data.quoteToken;
    this.priceNative = data.priceNative;
    this.priceUsd = data.priceUsd;
    this.txns = data.txns;
    this.volume = data.volume;
    this.priceChange = data.priceChange;
    this.liquidity = data.liquidity;
    this.fdv = data.fdv;
    this.marketCap = data.marketCap;
    this.pairCreatedAt = data.pairCreatedAt;
    this.info = data.info;
    this.boosts = data.boosts;
  }

  static fromDexScreener(data: DexScreenerPair): PairToken {
    return new PairToken(data);
  }

  get pairName(): string {
    return `${this.baseToken.symbol}/${this.quoteToken.symbol}`;
  }

  get formattedPriceUsd(): string {
    if (!this.priceUsd) return 'N/A';
    return `$${this.priceUsd}`;
  }

  get volume24h(): number {
    return this.volume?.h24 ?? 0;
  }

  get priceChange24h(): number {
    return this.priceChange?.h24 ?? 0;
  }

  get formattedLiquidity(): string {
    if (!this.liquidity?.usd) return 'N/A';
    return `$${this.liquidity.usd.toLocaleString()}`;
  }

  isPriceIncreasing(): boolean {
    return this.priceChange24h > 0;
  }

  getCreatedDate(): Date | null {
    if (!this.pairCreatedAt) return null;
    return new Date(this.pairCreatedAt);
  }
}
