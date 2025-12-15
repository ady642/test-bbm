import { useTranslation } from 'react-i18next';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { PairToken } from '../models/PairToken';
import { cn, formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

interface PairCardProps {
  pair: PairToken;
}

export function PairCard({ pair }: PairCardProps) {
  const { t } = useTranslation();

  const isPriceUp = pair.isPriceIncreasing();

  return (
    <div className="group relative bg-card border border-border rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:scale-[1.02]">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-lg sm:text-xl font-bold text-foreground truncate">{pair.pairName}</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
              {pair.chainId}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">{pair.dexId}</p>
        </div>
        <a
          href={pair.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-110"
          title={t('pair.viewOn')}
          aria-label={t('pair.viewOn')}
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-muted-foreground font-medium">{t('pair.price')}</span>
          <span className="text-lg font-bold text-foreground">
            {pair.formattedPriceUsd}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-muted-foreground font-medium">{t('pair.priceChange')}</span>
          <div
            className={cn(
              'flex items-center gap-1.5 font-bold text-base',
              isPriceUp ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
            )}
          >
            {isPriceUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{formatPercentage(pair.priceChange24h)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-muted-foreground font-medium">{t('pair.volume24h')}</span>
          <span className="text-sm font-semibold text-foreground">
            ${formatNumber(pair.volume24h)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-muted-foreground font-medium">{t('pair.liquidity')}</span>
          <span className="text-sm font-semibold text-foreground">
            {pair.formattedLiquidity}
          </span>
        </div>

        {pair.marketCap && (
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-muted-foreground font-medium">{t('pair.marketCap')}</span>
            <span className="text-sm font-semibold text-foreground">
              ${formatNumber(pair.marketCap)}
            </span>
          </div>
        )}
      </div>

      {pair.labels && pair.labels.length > 0 && (
        <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-2">
          {pair.labels.map((label, index) => (
            <span
              key={index}
              className="text-xs px-2.5 py-1 rounded-md bg-accent text-accent-foreground font-medium"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

PairCard.displayName = 'PairCard';
