'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EducationSection from '@/components/sections/EducationSection';
import { motion } from 'framer-motion';
import { Heart, Users, Leaf, Award } from 'lucide-react';

export default function SocialPage() {
  const socialImpacts = [
    {
      icon: Users,
      title: '발달장애인 고용',
      stats: '156+',
      description: '전문 농업인으로 성장할 수 있는 양질의 일자리 제공',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: '사회적 가치',
      stats: '85%',
      description: '장애인 고용률을 통한 포용적 성장 실현',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Leaf,
      title: 'ESG 경영',
      stats: 'AAA',
      description: '환경·사회·지배구조 최고 등급 달성',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: '사회공헌 실적',
      stats: '50억+',
      description: '누적 사회적 가치 창출 금액',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                ✦ SOCIAL IMPACT
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                함께 성장하는 <span className="text-blue-600">사회적 가치</span>
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                발달장애인과 함께 성장하며, 지속가능한 사회를 만들어가는
                NURI의 사회공헌 활동입니다.
              </p>
            </motion.div>

            {/* Impact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {socialImpacts.map((impact, idx) => {
                const Icon = impact.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${impact.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{impact.stats}</div>
                    <h3 className="font-bold text-lg mb-2">{impact.title}</h3>
                    <p className="text-gray-600 text-sm">{impact.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <EducationSection />

        {/* ESG Section */}
        <section id="esg" className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ESG 경영</h2>
              <p className="text-gray-600">지속가능한 미래를 위한 NURI의 약속</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Environmental</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ 탄소중립 스마트팜 운영</li>
                  <li>✓ 재생에너지 100% 사용</li>
                  <li>✓ 물 재활용 시스템</li>
                  <li>✓ 친환경 패키징</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Social</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ 발달장애인 1,000명 고용 목표</li>
                  <li>✓ 전문 교육 프로그램 운영</li>
                  <li>✓ 공정한 임금 보장</li>
                  <li>✓ 지역사회 협력</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-center mb-4">Governance</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ 투명한 경영</li>
                  <li>✓ 이사회 다양성</li>
                  <li>✓ 윤리경영 실천</li>
                  <li>✓ 이해관계자 소통</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}