'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Leaf, Target, Users, Award } from 'lucide-react';
import Image from 'next/image';
import { getJourneyItems, type JourneyItem } from '@/lib/journeyStore';

const coreValues = [
  {
    icon: Heart,
    title: '발달장애인과 함께',
    description: '발달장애인의 잠재력을 믿고 전문 농업인으로 성장할 수 있는 일자리를 창출합니다',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Leaf,
    title: '스마트팜 기술 혁신',
    description: 'AI와 IoT 기술을 활용한 첨단 스마트팜으로 농업의 미래를 선도합니다',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Target,
    title: 'ESG 경영 실천',
    description: '환경·사회·지배구조를 고려한 지속가능한 경영으로 사회적 가치를 창출합니다',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Globe,
    title: '글로벌 임팩트',
    description: '한국을 넘어 전 세계로 확장하여 글로벌 사회적 기업으로 성장합니다',
    color: 'from-purple-500 to-indigo-500'
  }
];

// Milestones will be loaded from journeyStore

const stats = [
  { number: '156+', label: '고용 창출', suffix: '명' },
  { number: '85%', label: '장애인 고용률', suffix: '' },
  { number: '12', label: '운영 농장', suffix: '개소' },
  { number: '320%', label: '매출 성장률', suffix: 'YoY' },
];

export default function AboutSection() {
  const [milestones, setMilestones] = useState<JourneyItem[]>([]);

  useEffect(() => {
    // Journey 데이터 불러오기
    const items = getJourneyItems();
    // 순서대로 정렬
    const sortedItems = items.sort((a, b) => a.order - b.order);
    setMilestones(sortedItems);
  }, []);

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">
            ✦ ABOUT NURI
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            더 나은 세상을 만드는 <span className="text-green-600">소셜 임팩트</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            누리는 발달장애인과 함께 성장하며, 스마트팜 기술로 농업의 미래를 혁신하고,
            ESG 경영을 통해 지속가능한 사회적 가치를 창출하는 글로벌 소셜 벤처입니다.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${value.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4 text-green-800">Our Mission</h3>
            <p className="text-gray-700 mb-4">
              "모든 사람이 자신의 능력을 발휘할 수 있는 포용적 일자리를 창출하고,
              지속가능한 농업 혁신을 통해 더 나은 미래를 만들어갑니다."
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">발달장애인 1,000명 고용 목표</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">탄소중립 스마트팜 100개소 구축</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">글로벌 10개국 진출</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4 text-blue-800">Our Vision</h3>
            <p className="text-gray-700 mb-4">
              "세계 최고의 소셜 임팩트 기업으로서, 기술과 사람이 조화롭게
              공존하는 지속가능한 농업 생태계를 구축합니다."
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">아시아 No.1 애그테크 기업</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">글로벌 ESG 리더십</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span className="text-gray-700">유니콘 기업 도약</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">Our Journey</h3>
          {milestones.length > 0 ? (
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-500 to-blue-500"></div>
              {milestones.map((milestone, index) => {
                // 카테고리별 색상 설정
                const getCategoryColor = () => {
                  switch (milestone.category) {
                    case 'foundation': return 'text-blue-600';
                    case 'expansion': return 'text-green-600';
                    case 'achievement': return 'text-yellow-600';
                    case 'investment': return 'text-purple-600';
                    case 'partnership': return 'text-indigo-600';
                    default: return 'text-green-600';
                  }
                };

                const getBorderColor = () => {
                  switch (milestone.category) {
                    case 'foundation': return 'border-blue-500';
                    case 'expansion': return 'border-green-500';
                    case 'achievement': return 'border-yellow-500';
                    case 'investment': return 'border-purple-500';
                    case 'partnership': return 'border-indigo-500';
                    default: return 'border-green-500';
                  }
                };

                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center mb-8 ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className={`bg-white rounded-lg shadow-lg p-4 inline-block ${
                        milestone.highlight ? 'ring-2 ring-yellow-400' : ''
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-2xl font-bold ${getCategoryColor()}`}>
                            {milestone.year}
                          </span>
                          {milestone.month && (
                            <span className="text-sm text-gray-500">{milestone.month}월</span>
                          )}
                          {milestone.highlight && (
                            <span className="text-yellow-500">⭐</span>
                          )}
                        </div>
                        <h4 className="font-bold mt-1">{milestone.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                      </div>
                    </div>
                    <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 ${getBorderColor()} rounded-full ${
                      milestone.highlight ? 'w-5 h-5' : ''
                    }`}></div>
                    <div className="w-1/2"></div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Journey 데이터를 불러오는 중...</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold text-center mb-8">Impact in Numbers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">
                  {stat.number}
                  <span className="text-xl">{stat.suffix}</span>
                </div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}