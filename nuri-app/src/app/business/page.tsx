'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/sections/ServicesSection';
import NuriCellSection from '@/components/sections/NuriCellSection';
import { motion } from 'framer-motion';
import { Building2, Globe, MapPin } from 'lucide-react';

export default function BusinessPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
                ✦ BUSINESS
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                NURI의 <span className="text-green-600">글로벌 사업</span>
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                스마트팜 기술과 사회적 가치를 결합한 혁신적인 비즈니스 모델로
                전 세계에 지속가능한 농업을 확산하고 있습니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* NURI Cell Section */}
        <NuriCellSection />

        {/* Global Workplaces Section */}
        <section id="global" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">글로벌 사업장 현황</h2>
              <p className="text-gray-600">전 세계에 확산되는 NURI의 사업장</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-bold">한국</h3>
                </div>
                <p className="text-gray-700 mb-4">국내 최대 규모의 스마트팜 네트워크</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>K1NURIfarm01 - 충청북도 음성</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>K2NURIshop01 - 서울 강남</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-bold">동남아시아</h3>
                </div>
                <p className="text-gray-700 mb-4">아시아 시장 확장의 전초기지</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>V1NURIfarm01 - 베트남 호치민</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>S1NURIfarm01 - 싱가포르</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                  <h3 className="text-xl font-bold">진출 예정</h3>
                </div>
                <p className="text-gray-700 mb-4">2025년 글로벌 확장 계획</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>일본, 미국, 중동</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}