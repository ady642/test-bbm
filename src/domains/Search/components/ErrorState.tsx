import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {t('error.title')}
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {error.message || t('error.default')}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          {t('error.retry')}
        </button>
      )}
    </div>
  );
};
