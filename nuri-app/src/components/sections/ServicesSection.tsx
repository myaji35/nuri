'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Cloud, GraduationCap, Cpu,
  CheckCircle, ArrowRight, Zap, Shield,
  BarChart, Users, Settings, Globe,
  Package, Layers, Target, Sparkles
} from 'lucide-react';

const services = [
  {
    id: 'smartfarm',
    icon: Building2,
    title: '스마트팜 구축',
    subtitle: 'Turnkey Smart Farm Solution',
    description: '누리셀, 창고랙, 모빌랙, 마이크로프로세서 컨트롤을 적용한 설계부터 운영까지 원스톱으로 제공합니다',
    features: [
      '누리셀 (NURI Cell) - 모듈형 재배 시스템',
      '창고랙 & 모빌랙 - 공간 효율 극대화',
      'P-AI Hoist (파이 호이스트) - Physical AI 기반 자동 운반',
      '마이크로프로세서 컨트롤 - 정밀 자동화',
      '통합 운영 관리 시스템'
    ],
    benefits: [
      { icon: Zap, text: '생산성 40% 향상' },
      { icon: Shield, text: '3년 품질 보증' },
      { icon: Users, text: '장애인 고용 지원' }
    ],
    color: 'from-green-500 to-emerald-600',
    image: '/api/placeholder/600/400'
  },
  {
    id: 'saas',
    icon: Cloud,
    title: 'SaaS 플랫폼',
    subtitle: 'Cloud-based Farm Management',
    description: 'AI 기반 농업 데이터 분석 플랫폼으로 스마트팜을 효율적으로 관리하고 수익을 극대화합니다',
    features: [
      '실시간 환경 모니터링 대시보드',
      'AI 작물 생육 예측 및 분석',
      '자동 리포트 생성 및 알림',
      '모바일 앱 원격 제어'
    ],
    benefits: [
      { icon: BarChart, text: '데이터 기반 의사결정' },
      { icon: Globe, text: '언제 어디서나 접속' },
      { icon: Settings, text: '자동화 워크플로우' }
    ],
    color: 'from-blue-500 to-cyan-600',
    image: '/api/placeholder/600/400'
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: '장애인 직업교육',
    subtitle: 'Vocational Education for People with Disabilities',
    description: '발달장애인이 농업 전문가로 성장할 수 있도록 대학 연계, 자격증, 기숙형 교육 프로그램을 운영합니다',
    features: [
      '대학 공동 커리큘럼 개발 (2년 과정)',
      '민간자격증 과정 (스마트팜 관리사)',
      '기숙형 생활교육 (24시간 돌봄)',
      '취업 보장 프로그램'
    ],
    benefits: [
      { icon: GraduationCap, text: '정규 학위/자격증' },
      { icon: Users, text: '92% 취업률' },
      { icon: CheckCircle, text: '평생 케어 시스템' }
    ],
    color: 'from-purple-500 to-indigo-600',
    image: '/api/placeholder/600/400'
  },
  {
    id: 'iot',
    icon: Cpu,
    title: 'IoT 장비',
    subtitle: 'Smart Farming Hardware',
    description: '최첨단 IoT 센서와 제어 장비로 스마트팜의 완벽한 자동화를 실현합니다',
    features: [
      '환경 센서 (온습도, CO2, 조도)',
      '양액 자동 제어 시스템',
      'LED 생장등 및 제어기',
      '통합 관제 시스템'
    ],
    benefits: [
      { icon: Cpu, text: '최신 IoT 기술' },
      { icon: Shield, text: '산업용 내구성' },
      { icon: Zap, text: '에너지 효율 최적화' }
    ],
    color: 'from-orange-500 to-red-600',
    image: '/api/placeholder/600/400'
  }
];

const processSteps = [
  { step: '01', title: '상담 신청', description: '무료 상담으로 맞춤형 솔루션 제안' },
  { step: '02', title: '현장 실사', description: '전문가 방문 및 환경 분석' },
  { step: '03', title: '설계/계획', description: '최적화된 스마트팜 설계' },
  { step: '04', title: '구축/설치', description: '전문 시공팀 투입' },
  { step: '05', title: '교육/운영', description: '운영 교육 및 지속 관리' },
];

const oneStopSolution = {
  title: "NURI의 완벽한 원스톱 솔루션",
  subtitle: "농업의 시작부터 성공까지, 모든 단계를 함께합니다",
  description: "하드웨어, 소프트웨어, 교육, 운영 지원까지 통합된 토탈 솔루션으로 농업 혁신을 실현합니다",
  components: [
    {
      icon: Building2,
      title: "스마트팜 인프라",
      items: ["최첨단 온실 설계", "자동화 시스템 구축", "IoT 센서 네트워크", "환경 제어 시스템"],
      color: "bg-green-100 text-green-700"
    },
    {
      icon: Cloud,
      title: "데이터 플랫폼",
      items: ["AI 생육 예측", "실시간 모니터링", "빅데이터 분석", "클라우드 관리"],
      color: "bg-blue-100 text-blue-700"
    },
    {
      icon: Users,
      title: "인재 양성",
      items: ["발달장애인 교육", "전문가 양성", "맞춤형 커리큘럼", "취업 연계"],
      color: "bg-purple-100 text-purple-700"
    },
    {
      icon: Shield,
      title: "운영 지원",
      items: ["24/7 기술 지원", "정기 점검 서비스", "수익성 컨설팅", "품질 인증 지원"],
      color: "bg-orange-100 text-orange-700"
    }
  ],
  advantages: [
    { icon: Package, title: "통합 관리", description: "하나의 플랫폼에서 모든 것을 관리" },
    { icon: Target, title: "맞춤형 솔루션", description: "고객의 needs에 최적화된 설계" },
    { icon: Sparkles, title: "혁신 기술", description: "AI, IoT 등 최신 기술 적용" },
    { icon: Layers, title: "단계별 지원", description: "성장 단계별 맞춤 서비스" }
  ],
  stats: [
    { number: "156+", label: "고용 창출", unit: "명" },
    { number: "40%", label: "생산성 향상", unit: "↑" },
    { number: "92%", label: "고객 만족도", unit: "%" },
    { number: "24/7", label: "기술 지원", unit: "" }
  ]
};

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState(services[0]);

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">
            ✦ OUR SERVICES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            완벽한 <span className="text-blue-600">원스톱 솔루션</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            스마트팜 구축부터 운영, 교육, 데이터 분석까지 농업의 모든 과정을 혁신합니다
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedService(service)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                  selectedService.id === service.id
                    ? 'bg-gradient-to-r text-white shadow-lg ' + service.color
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{service.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Service Detail */}
        <motion.div
          key={selectedService.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${selectedService.color} mb-4`}>
                <selectedService.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{selectedService.title}</h3>
              <p className="text-gray-500 mb-4">{selectedService.subtitle}</p>
              <p className="text-gray-700 mb-6">{selectedService.description}</p>

              {/* Features */}
              <div className="mb-8">
                <h4 className="font-bold mb-4">주요 기능</h4>
                <ul className="space-y-2">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-4">
                {selectedService.benefits.map((benefit, idx) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                      <BenefitIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image */}
            <div className={`relative bg-gradient-to-br ${selectedService.color} p-8 flex items-center justify-center`}>
              <div className="bg-white/10 backdrop-blur rounded-lg p-8">
                <selectedService.icon className="w-48 h-48 text-white/20" />
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  자세히 알아보기
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* One-Stop Solution Section */}
        <div className="mt-20 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {oneStopSolution.title}
            </h3>
            <p className="text-xl text-gray-600 mb-2">{oneStopSolution.subtitle}</p>
            <p className="text-gray-500 max-w-3xl mx-auto">{oneStopSolution.description}</p>
          </div>

          {/* Solution Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {oneStopSolution.components.map((component, idx) => {
              const Icon = component.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className={`inline-flex p-3 rounded-lg ${component.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-3">{component.title}</h4>
                  <ul className="space-y-2">
                    {component.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Advantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {oneStopSolution.advantages.map((advantage, idx) => {
              const Icon = advantage.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-white/80 backdrop-blur p-4 rounded-lg"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{advantage.title}</h5>
                    <p className="text-sm text-gray-600">{advantage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {oneStopSolution.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {stat.number}
                  <span className="text-2xl">{stat.unit}</span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all inline-flex items-center gap-2">
              <Package className="w-5 h-5" />
              원스톱 솔루션 상담받기
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">서비스 프로세스</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center max-w-[150px]"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                  {step.step}
                </div>
                <h4 className="font-bold mb-1">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
                {idx < processSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute right-0 top-8 text-gray-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}