'use client';

import { Suspense } from 'react';
import Globe from '@/components/globe/Globe';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoadingGlobe } from '@/components/LoadingGlobe';
import { useLanguage } from '@/contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-gray-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            {t.header.title}
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-2">
            {t.header.subtitle}
          </p>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Globe Container */}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingGlobe />}>
          <Globe />
        </Suspense>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-gray-800/90 backdrop-blur p-3 md:p-4 rounded-lg">
        <h3 className="text-sm md:text-base font-semibold text-white mb-2">{t.legend.title}</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-[#FFC700] rounded"></div>
            <span className="text-xs md:text-sm text-gray-300">{t.legend.tier1}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-[#4A90E2] rounded"></div>
            <span className="text-xs md:text-sm text-gray-300">{t.legend.tier2}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-[#E0E0E0] rounded"></div>
            <span className="text-xs md:text-sm text-gray-300">{t.legend.tier3}</span>
          </div>
        </div>
      </div>
    </main>
  );
}