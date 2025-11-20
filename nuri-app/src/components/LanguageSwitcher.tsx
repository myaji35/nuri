'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { locales } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex gap-2">
      {locales.map((lng) => (
        <Button
          key={lng}
          variant={locale === lng ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLocale(lng)}
          className="min-w-[3rem]"
        >
          {lng.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}