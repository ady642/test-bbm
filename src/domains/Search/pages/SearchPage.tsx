import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchForm } from '../components/SearchForm';
import { PairCard } from '../components/PairCard';
import { Pagination } from '../components/Pagination';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useSearchPairs } from '../hooks/useSearchPairs';
import { useSearchStore } from '../store/searchStore';

export const SearchPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { paginator } = useSearchStore();
  const { isLoading, error, refetch } = useSearchPairs(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
  };

  const currentPageItems = useMemo(() => {
    return paginator.getCurrentPageItems();
  }, [paginator]);

  const handleNextPage = () => {
    useSearchStore.getState().nextPage();
  };

  const handlePreviousPage = () => {
    useSearchStore.getState().previousPage();
  };

  const handleGoToPage = (page: number) => {
    useSearchStore.getState().goToPage(page);
  };

  const handleGoToFirstPage = () => {
    useSearchStore.getState().goToPage(1);
  };

  const handleGoToLastPage = () => {
    useSearchStore.getState().goToPage(paginator.getTotalPages());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex justify-end items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
              {t('app.title')}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t('app.description')}
            </p>
          </div>
        </header>

        <div className="mb-8 sm:mb-10 lg:mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {isLoading && <LoadingState />}

        {error && <ErrorState error={error as Error} onRetry={() => refetch()} />}

        {!isLoading && !error && currentPageItems.length === 0 && (
          <EmptyState hasSearched={hasSearched} />
        )}

        {!isLoading && !error && currentPageItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {currentPageItems.map((pair) => (
                <PairCard key={pair.pairAddress} pair={pair} />
              ))}
            </div>

            <Pagination
              currentPage={paginator.getCurrentPage()}
              totalPages={paginator.getTotalPages()}
              onPageChange={handleGoToPage}
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              onFirst={handleGoToFirstPage}
              onLast={handleGoToLastPage}
              hasNext={paginator.hasNextPage()}
              hasPrevious={paginator.hasPreviousPage()}
              pageRange={paginator.getPageRange()}
              totalItems={paginator.getTotalItems()}
            />
          </>
        )}
      </div>
    </div>
  );
};
