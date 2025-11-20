'use client';

import { Building2, Cloud, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function ServicesPreview() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return null; // Don't show preview if authenticated
  }

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Our Solutions
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Discover how NURI's smart farming solutions are transforming agriculture worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Smart Farm Construction */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
            <Building2 className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="text-xl font-bold mb-2">Smart Farm Construction</h3>
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              Complete turnkey solution from design to operation with NURI Cell technology,
              warehouse racks, and microprocessor control systems.
            </p>
            <div className="flex items-center text-green-600 font-semibold text-sm">
              <span className="mr-2">Login to see full details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* SaaS Platform */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <Cloud className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="text-xl font-bold mb-2">SaaS Platform</h3>
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              Cloud-based farm management platform with AI-powered analytics for
              maximizing productivity and profitability.
            </p>
            <div className="flex items-center text-blue-600 font-semibold text-sm">
              <span className="mr-2">Login to see full details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* CTA Section - More Compact */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white text-center">
          <h3 className="text-lg md:text-xl font-bold mb-2">
            Want to see more detailed information?
          </h3>
          <p className="mb-4 opacity-90 text-sm">
            Login to access comprehensive details about our solutions, case studies, and technical specifications
          </p>
          <Link href="/business">
            <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-2.5 text-sm md:text-base">
              {t.nav.login} to Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
