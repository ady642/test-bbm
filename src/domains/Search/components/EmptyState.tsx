import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  hasSearched: boolean;
}

export function EmptyState({ hasSearched }: EmptyStateProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      
      {!hasSearched ? (
        <>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t('empty.initial.title')}
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            {t('empty.initial.description')}
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t('empty.noResults.title')}
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            {t('empty.noResults.description')}
          </p>
        </>
      )}
    </div>
  );
}
