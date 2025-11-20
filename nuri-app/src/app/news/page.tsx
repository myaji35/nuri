'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsSection from '@/components/sections/NewsSection';
import { motion } from 'framer-motion';

export default function NewsPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-yellow-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-yellow-600 font-semibold text-sm uppercase tracking-wider">
                ✦ NEWS & UPDATES
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                NURI의 <span className="text-yellow-600">최신 소식</span>
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                NURI의 성장과 혁신, 그리고 사회적 가치 창출에 대한
                최신 뉴스와 업데이트를 확인하세요.
              </p>
            </motion.div>
          </div>
        </section>

        {/* News Section */}
        <NewsSection />
      </main>
      <Footer />
    </>
  );
}