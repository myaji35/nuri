'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, Maximize2, Cpu, Zap, CheckCircle, ArrowRight, Truck } from 'lucide-react';

export default function NuriCellSection() {
  const features = [
    {
      icon: Package,
      title: '누리셀 (NURI Cell)',
      description: '모듈형 재배 유닛으로 작물별 최적 환경 구현'
    },
    {
      icon: Maximize2,
      title: '창고랙 & 모빌랙',
      description: '수직 공간 활용으로 3배 이상의 생산성 확보'
    },
    {
      icon: Truck,
      title: 'P-AI Hoist (파이 호이스트)',
      description: 'Physical AI 기반 지능형 자동 운반 시스템'
    },
    {
      icon: Cpu,
      title: '마이크로프로세서 컨트롤',
      description: '정밀한 환경 제어로 품질 균일성 95% 달성'
    },
    {
      icon: Zap,
      title: '완전 자동화 시스템',
      description: '급수, 양액, 온습도를 자동으로 관리'
    }
  ];

  const advantages = [
    '기존 농장 대비 60% 공간 절약',
    '연중 안정적인 생산량 확보',
    '발달장애인도 쉽게 운영 가능한 인터페이스',
    '에너지 효율 40% 향상'
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            ✦ NURI CELL TECHNOLOGY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            누리만의 <span className="text-green-600">혁신 재배 시스템</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            누리셀을 창고랙에 적용하여 공간 효율을 극대화하고,
            마이크로프로세서로 정밀하게 제어하는 차세대 스마트팜 솔루션
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative bg-gray-200">
                <Image
                  src="https://drive.google.com/uc?export=view&id=1sojMBmJn74YbLlxX0BoWSuSE2ZEzqXsc"
                  alt="누리셀 창고랙 시스템 - 수직형 스마트팜 재배 시스템"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Overlay Badge */}
              <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                특허 출원 기술
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border-l-4 border-green-600">
              <div className="text-3xl font-bold text-green-600">3x</div>
              <div className="text-sm text-gray-600">공간 효율 향상</div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6">핵심 기술 요소</h3>
            <div className="space-y-4 mb-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Advantages Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            누리셀 시스템의 차별화된 장점
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advantages.map((advantage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <span className="text-lg">{advantage}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg">
              누리셀 시스템 상담 신청하기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">시스템 가동률</div>
            <p className="text-sm text-gray-500 mt-2">24시간 무중단 운영</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">±0.5°C</div>
            <div className="text-gray-600">온도 제어 정밀도</div>
            <p className="text-sm text-gray-500 mt-2">마이크로프로세서 제어</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">5층</div>
            <div className="text-gray-600">최대 적재 높이</div>
            <p className="text-sm text-gray-500 mt-2">모빌랙 시스템</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}