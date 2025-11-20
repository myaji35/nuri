'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Zap, Shield, BarChart3, Leaf, Sun,
  Droplets, Wind, ThermometerSun, Activity,
  Wifi, Camera, Bot, TrendingUp
} from 'lucide-react';

const innovations = [
  {
    id: 'automation',
    title: '완전 자동화 시스템',
    subtitle: 'Full Automation System',
    description: '발달장애인도 쉽게 운영할 수 있는 완전 자동화 스마트팜 시스템',
    icon: Bot,
    color: 'from-purple-500 to-indigo-600',
    stats: {
      efficiency: '95%',
      labor: '-70%',
      accuracy: '99.9%'
    },
    features: [
      {
        icon: Droplets,
        title: '자동 관수 시스템',
        description: 'AI 기반 작물별 맞춤 급수'
      },
      {
        icon: Sun,
        title: 'LED 생장등 제어',
        description: '광합성 최적화 자동 조절'
      },
      {
        icon: ThermometerSun,
        title: '환경 자동 제어',
        description: '온도, 습도, CO2 실시간 조절'
      },
      {
        icon: Activity,
        title: '생육 모니터링',
        description: '컴퓨터 비전 기반 성장 추적'
      }
    ],
    techStack: ['PLC Control', 'SCADA', 'Edge Computing', 'Computer Vision']
  }
];

const researchProjects = [
  {
    title: 'AI 수확량 예측',
    progress: 85,
    description: '머신러닝 기반 3개월 수확량 예측',
    impact: '정확도 92%'
  },
  {
    title: '병해충 자동 진단',
    progress: 70,
    description: '이미지 인식 기반 조기 진단 시스템',
    impact: '피해 60% 감소'
  },
  {
    title: '에너지 최적화',
    progress: 90,
    description: '재생에너지 활용 탄소중립 농장',
    impact: '에너지 40% 절감'
  },
  {
    title: '로봇 수확 시스템',
    progress: 60,
    description: '자율 주행 수확 로봇 개발',
    impact: '수확 속도 3배'
  }
];

const patents = [
  { number: 'KR-2023-0156789', title: '발달장애인 친화적 스마트팜 인터페이스', year: '2023' },
  { number: 'KR-2023-0145678', title: 'AI 기반 작물 생육 예측 시스템', year: '2023' },
  { number: 'KR-2022-0134567', title: '자동화 양액 제어 장치', year: '2022' },
  { number: 'PCT/KR2023/012345', title: 'IoT 센서 통합 관리 플랫폼', year: '2023' }
];

export default function InnovationSection() {
  const [activeTab, setActiveTab] = useState('technology');
  const innovation = innovations[0]; // 자동화 시스템 focused

  return (
    <section id="innovation" className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">
            ✦ INNOVATION & TECHNOLOGY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            미래를 만드는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">혁신 기술</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            최첨단 자동화 시스템과 AI 기술로 농업의 새로운 패러다임을 제시합니다
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-12">
          {['technology', 'research', 'patents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'technology' && '핵심 기술'}
              {tab === 'research' && 'R&D 프로젝트'}
              {tab === 'patents' && '특허 & IP'}
            </button>
          ))}
        </div>

        {/* Technology Tab */}
        {activeTab === 'technology' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Main Innovation */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${innovation.color} mb-4`}>
                    <innovation.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{innovation.title}</h3>
                  <p className="text-gray-400 mb-4">{innovation.subtitle}</p>
                  <p className="text-gray-300 mb-8">{innovation.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{innovation.stats.efficiency}</div>
                      <div className="text-sm text-gray-400">자동화율</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{innovation.stats.labor}</div>
                      <div className="text-sm text-gray-400">인력 절감</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{innovation.stats.accuracy}</div>
                      <div className="text-sm text-gray-400">제어 정확도</div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {innovation.techStack.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {innovation.features.map((feature, idx) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      >
                        <FeatureIcon className="w-8 h-8 text-yellow-400 mb-3" />
                        <h4 className="font-bold mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* System Architecture */}
            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">시스템 아키텍처</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { icon: Wifi, title: 'IoT Layer', description: '센서 데이터 수집' },
                  { icon: Cpu, title: 'Edge Computing', description: '실시간 데이터 처리' },
                  { icon: Shield, title: 'Cloud Platform', description: '데이터 저장 및 분석' },
                  { icon: BarChart3, title: 'AI Analytics', description: '예측 및 최적화' }
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={idx} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ItemIcon className="w-8 h-8 text-black" />
                      </div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Research Tab */}
        {activeTab === 'research' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {researchProjects.map((project, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                    <p className="text-gray-400">{project.description}</p>
                  </div>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {project.impact}
                  </span>
                </div>
                <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${project.progress}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="absolute h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                </div>
                <div className="mt-2 text-right text-sm text-gray-400">
                  진행률: {project.progress}%
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Patents Tab */}
        {activeTab === 'patents' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {patents.map((patent, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-yellow-400 font-mono text-sm">{patent.number}</span>
                  <span className="text-gray-500 text-sm">{patent.year}</span>
                </div>
                <h3 className="font-bold">{patent.title}</h3>
              </motion.div>
            ))}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-black md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">지식재산권 현황</h3>
                  <p className="opacity-80">등록 특허 12건 | 출원 중 8건 | PCT 3건</p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}