'use client';

import GlobeWrapper from '@/components/globe/GlobeWrapper';
import ServicesSection from '@/components/sections/ServicesSection';
import ServicesPreview from '@/components/sections/ServicesPreview';
import ImpactPreview from '@/components/sections/ImpactPreview';
import EducationSection from '@/components/sections/EducationSection';
import IncomeFlowChart from '@/components/sections/IncomeFlowChart';
import InnovationSection from '@/components/sections/InnovationSection';
import NewsSection from '@/components/sections/NewsSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section with Globe - Ultra Compact */}
      <section className="relative bg-gradient-to-b from-green-50 to-white pt-20 pb-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
            <div className="space-y-2 lg:pr-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-gray-900">
                {t.hero.title.split('\\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>
              <p className="text-xs md:text-sm text-gray-600 leading-snug">
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 text-xs md:text-sm rounded-full shadow-lg hover:shadow-xl transition-all">
                  {t.hero.cta} →
                </Button>
                {!isAuthenticated && (
                  <Link href="#login">
                    <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold px-4 py-2 text-xs md:text-sm rounded-full shadow-lg hover:shadow-xl transition-all">
                      {t.nav.login} for Full Access
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="relative flex items-center justify-center py-4">
              {/* Circular Globe Container - Much Smaller */}
              <div className="relative w-[220px] h-[220px] md:w-[260px] md:h-[260px] lg:w-[300px] lg:h-[300px]">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-green-200/20 to-yellow-200/20 rounded-full blur-2xl"></div>
                {/* Circle border */}
                <div className="absolute inset-0 rounded-full border border-gray-200/30 shadow-inner"></div>
                {/* Globe container - dark space background for better visibility */}
                <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  <GlobeWrapper />
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Show preview or full based on auth */}
      {isAuthenticated ? <ServicesSection /> : <ServicesPreview />}

      {/* Impact Statistics - Show preview or full based on auth */}
      {isAuthenticated ? (
        <>
          <EducationSection />
          <IncomeFlowChart />
          <InnovationSection />
        </>
      ) : (
        <ImpactPreview />
      )}

      {/* SaaS Platform Section - Compact Version */}
      <section className="py-10 bg-gradient-to-br from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-white/90 font-semibold text-xs uppercase tracking-wider">✦ SAAS PLATFORM</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 text-gray-900">
                Intelligent SaaS Platform
              </h2>
              <p className="text-gray-800 mb-4 text-sm md:text-base leading-relaxed">
                Data-driven platform that leads the future of agriculture by collecting and analyzing
                all cultivation data to provide optimal growing environments.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg hover:bg-white/40 transition-colors">
                  <h4 className="font-bold mb-1 text-sm text-gray-900">Real-time Monitoring</h4>
                  <p className="text-xs text-gray-800">24/7 farm status tracking</p>
                </div>
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg hover:bg-white/40 transition-colors">
                  <h4 className="font-bold mb-1 text-sm text-gray-900">AI Predictive Analytics</h4>
                  <p className="text-xs text-gray-800">Yield & quality forecasting</p>
                </div>
                {isAuthenticated && (
                  <>
                    <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg hover:bg-white/40 transition-colors">
                      <h4 className="font-bold mb-1 text-sm text-gray-900">Remote Control</h4>
                      <p className="text-xs text-gray-800">Anywhere, anytime management</p>
                    </div>
                    <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg hover:bg-white/40 transition-colors">
                      <h4 className="font-bold mb-1 text-sm text-gray-900">Data Analytics</h4>
                      <p className="text-xs text-gray-800">Insights & optimization</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-xl shadow-xl">
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                {isAuthenticated ? 'Start Your Free Trial' : 'Login to Access Platform'}
              </h3>
              <p className="mb-4 text-gray-300 text-sm">
                {isAuthenticated
                  ? 'Experience NURI SaaS platform today'
                  : 'Login to see detailed features and start your free trial'}
              </p>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 text-sm md:text-base rounded-lg shadow-lg hover:shadow-xl transition-all">
                {isAuthenticated ? 'Start Free Trial' : t.nav.login}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section - Show limited for non-auth */}
      {isAuthenticated ? <NewsSection /> : null}

      {/* Footer */}
      <Footer />
    </div>
  );
}