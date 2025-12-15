import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFormData {
  query: string;
}

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>();

  const onSubmit = (data: SearchFormData) => {
    onSearch(data.query);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </div>
        <input
          {...register('query', {
            required: t('search.validation.required'),
            minLength: {
              value: 2,
              message: t('search.validation.minLength'),
            },
          })}
          type="text"
          placeholder={t('search.placeholder')}
          disabled={isLoading}
          className={cn(
            'w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg rounded-xl border-2 transition-all',
            'bg-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            errors.query ? 'border-destructive' : 'border-input hover:border-primary/50'
          )}
        />
      </div>
      {errors.query && (
        <p className="mt-2 text-sm text-destructive">{errors.query.message}</p>
      )}
    </form>
  );
};
