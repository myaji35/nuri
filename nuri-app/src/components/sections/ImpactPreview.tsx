'use client';

import { Users, TrendingUp, Globe2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ImpactPreview() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return null;
  }

  return (
    <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Global Social Impact
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Creating sustainable value through inclusive employment and smart agriculture
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Employment Impact */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-1">Employment</h3>
            <div className="text-2xl font-bold text-green-600 mb-1">150+</div>
            <p className="text-gray-600 text-xs">
              People with disabilities employed
            </p>
            <div className="mt-3 flex items-center text-xs text-green-600 font-medium">
              <span className="blur-sm">More details available</span>
            </div>
          </div>

          {/* Global Reach */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <Globe2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-1">Global Sites</h3>
            <div className="text-2xl font-bold text-blue-600 mb-1">12+</div>
            <p className="text-gray-600 text-xs">
              Countries with implemented farms
            </p>
            <div className="mt-3 flex items-center text-xs text-blue-600 font-medium">
              <span className="blur-sm">More details available</span>
            </div>
          </div>

          {/* Growth */}
          <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold mb-1">Growth</h3>
            <div className="text-2xl font-bold text-yellow-600 mb-1">300%</div>
            <p className="text-gray-600 text-xs">
              Year-over-year expansion
            </p>
            <div className="mt-3 flex items-center text-xs text-yellow-600 font-medium">
              <span className="blur-sm">More details available</span>
            </div>
          </div>
        </div>

        {/* Login CTA - Compact */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100 text-center">
          <h3 className="text-lg md:text-xl font-bold mb-2">
            See Detailed Statistics & Case Studies
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Access comprehensive data, success stories, and impact reports by logging in
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 text-sm md:text-base inline-flex items-center gap-2">
            {t.nav.login}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
