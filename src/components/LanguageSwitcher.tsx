import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={cn(
            'px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2',
            i18n.language === lang.code
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
          )}
          aria-label={`${t('language.select')}: ${lang.label}`}
          title={lang.label}
        >
          <span className="text-base sm:text-lg">{lang.flag}</span>
          <span className="hidden md:inline">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
