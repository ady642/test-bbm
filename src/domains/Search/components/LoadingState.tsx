import { useTranslation } from 'react-i18next';
import { LoaderCircle } from 'lucide-react';

export function LoadingState() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <LoaderCircle className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">{t('search.searching')}</p>
    </div>
  );
};
