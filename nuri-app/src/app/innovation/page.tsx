'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InnovationSection from '@/components/sections/InnovationSection';
import { motion } from 'framer-motion';

export default function InnovationPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
                ✦ INNOVATION
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                기술로 만드는 <span className="text-purple-600">농업의 미래</span>
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                AI, IoT, 빅데이터 기술을 활용한 첨단 스마트팜 솔루션으로
                농업 혁신을 선도하고 있습니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Innovation Section */}
        <InnovationSection />
      </main>
      <Footer />
    </>
  );
}