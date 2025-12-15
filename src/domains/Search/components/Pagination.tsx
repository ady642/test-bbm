import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFirst: () => void;
  onLast: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  pageRange: { start: number; end: number };
  totalItems: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrevious,
  onFirst,
  onLast,
  hasNext,
  hasPrevious,
  pageRange,
  totalItems,
}: PaginationProps) {
  const { t } = useTranslation();
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
      <div className="text-xs sm:text-sm text-muted-foreground text-center px-4">
        {t('pagination.showing', { start: pageRange.start, end: pageRange.end, total: totalItems })}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
        <button
          onClick={onFirst}
          disabled={!hasPrevious}
          className={cn(
            'p-2 rounded-lg border transition-colors',
            hasPrevious
              ? 'border-input hover:bg-accent hover:text-accent-foreground'
              : 'border-input opacity-50 cursor-not-allowed'
          )}
          aria-label={t('pagination.first')}
        >
          <ChevronsLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={cn(
            'p-2 rounded-lg border transition-colors',
            hasPrevious
              ? 'border-input hover:bg-accent hover:text-accent-foreground'
              : 'border-input opacity-50 cursor-not-allowed'
          )}
          aria-label={t('pagination.previous')}
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-1.5 sm:py-2 text-muted-foreground text-sm sm:text-base">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'min-w-[32px] sm:min-w-[40px] px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg border transition-all hover:bg-accent hover:text-accent-foreground',
                  currentPage === page
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background'
                )}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={cn(
            'p-2 rounded-lg border transition-all',
            'hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={onLast}
          disabled={!hasNext}
          className={cn(
            'p-2 rounded-lg border transition-all',
            'hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent'
          )}
          aria-label="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
