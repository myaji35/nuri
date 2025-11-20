'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Building, Award, Home, Users, BookOpen,
  Calendar, Clock, Target, CheckCircle, ArrowRight,
  Briefcase, Heart, Brain, HandHeart, Sprout
} from 'lucide-react';

const educationPrograms = [
  {
    id: 'university',
    icon: Building,
    title: '대학 연계 프로그램',
    subtitle: 'University Partnership Program',
    description: '주요 대학과 공동 개발한 체계적인 농업 전문 교육 커리큘럼',
    duration: '2년 과정',
    certification: '농업전문가 학위',
    features: [
      {
        title: '산학협력 커리큘럼',
        items: [
          '서울대 농업생명과학대학 공동 개발',
          '한국농수산대학 실무 교육 연계',
          '특수교육학과 협업 프로그램',
          '현장 실습 중심 교육'
        ]
      },
      {
        title: '교육 내용',
        items: [
          '스마트팜 기초 이론',
          '작물 재배 실습',
          'IoT 장비 운영',
          '농업 경영 기초'
        ]
      }
    ],
    benefits: [
      { icon: GraduationCap, text: '정규 학위 취득' },
      { icon: Briefcase, text: '취업 보장' },
      { icon: Award, text: '장학금 지원' }
    ],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'certification',
    icon: Award,
    title: '민간자격증 과정',
    subtitle: 'Professional Certification',
    description: 'NURI가 개발한 농업 전문가 민간자격증 취득 프로그램',
    duration: '6개월 과정',
    certification: 'NURI 인증 자격증',
    features: [
      {
        title: '자격증 종류',
        items: [
          '스마트팜 관리사 (1급/2급)',
          '수경재배 전문가',
          '농업 데이터 분석사',
          '친환경 농업 지도사'
        ]
      },
      {
        title: '교육 특징',
        items: [
          '실무 중심 교육',
          '1:1 맞춤 지도',
          '온라인/오프라인 병행',
          '재시험 기회 제공'
        ]
      }
    ],
    benefits: [
      { icon: Award, text: '국가공인 추진중' },
      { icon: Clock, text: '평생교육 인정' },
      { icon: Users, text: '취업 연계' }
    ],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'residential',
    icon: Home,
    title: '기숙형 생활교육',
    subtitle: 'Residential Training Program',
    description: '24시간 돌봄과 교육이 결합된 전문 기숙형 직업훈련 프로그램',
    duration: '1년 과정',
    certification: '수료증 + 취업연계',
    features: [
      {
        title: '생활 지원',
        items: [
          '전문 생활지도사 24시간 상주',
          '개인별 맞춤 케어 프로그램',
          '의료 지원 체계 구축',
          '여가 및 문화 프로그램'
        ]
      },
      {
        title: '직업 훈련',
        items: [
          '오전: 이론 교육',
          '오후: 실습 훈련',
          '저녁: 생활 기술 교육',
          '주말: 사회 적응 훈련'
        ]
      }
    ],
    benefits: [
      { icon: Home, text: '안전한 주거환경' },
      { icon: Heart, text: '전인적 성장' },
      { icon: HandHeart, text: '가족 부담 경감' }
    ],
    color: 'from-purple-500 to-pink-600'
  }
];

const curriculum = {
  basic: [
    { week: '1-4주', content: '기초 농업 이론 및 안전교육', practical: '농장 견학 및 기초 실습' },
    { week: '5-8주', content: '작물별 재배 기술', practical: '파종 및 육묘 실습' },
    { week: '9-12주', content: '스마트팜 시스템 이해', practical: 'IoT 장비 조작 실습' },
    { week: '13-16주', content: '병해충 관리', practical: '방제 및 관리 실습' },
  ],
  advanced: [
    { week: '17-20주', content: '데이터 분석 기초', practical: '생육 데이터 기록' },
    { week: '21-24주', content: '자동화 시스템 운영', practical: '자동화 장비 운영' },
    { week: '25-28주', content: '품질 관리 및 수확', practical: '선별 및 포장 실습' },
    { week: '29-32주', content: '농업 경영 기초', practical: '판매 및 유통 실습' },
  ]
};

const partners = [
  { name: '충청대학교', type: '교육 협력', icon: GraduationCap },
  { name: '대구대학교', type: '특수교육 협력', icon: GraduationCap },
  { name: '음성 꽃동네학교', type: '특수교육 협력', icon: Heart },
  { name: '푸르메 여주팜', type: '현장실습 협력', icon: Sprout },
  { name: '한국장애인고용공단', type: '고용 지원', icon: Users },
  { name: '농림축산식품부', type: '정책 지원', icon: Building },
  { name: '특수교육지원센터', type: '교육 지원', icon: HandHeart },
];

const stats = [
  { number: '500+', label: '누적 교육생', icon: Users },
  { number: '92%', label: '취업률', icon: Briefcase },
  { number: '4.8/5', label: '만족도', icon: Heart },
  { number: '7+', label: '협력 기관', icon: Building },
];

export default function EducationSection() {
  const [selectedProgram, setSelectedProgram] = useState(educationPrograms[0]);
  const [curriculumTab, setCurriculumTab] = useState<'basic' | 'advanced'>('basic');

  return (
    <section id="education" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">
            ✦ EDUCATION & TRAINING
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            발달장애인 <span className="text-blue-600">전문 직업교육</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            체계적인 교육과 돌봄을 통해 발달장애인이 농업 전문가로 성장할 수 있도록
            대학 연계, 자격증, 기숙형 교육 프로그램을 운영합니다
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 text-center"
              >
                <Icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Program Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {educationPrograms.map((program) => {
            const Icon = program.icon;
            return (
              <motion.button
                key={program.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProgram(program)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                  selectedProgram.id === program.id
                    ? 'bg-gradient-to-r text-white shadow-lg ' + program.color
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{program.title}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Program Detail */}
        <motion.div
          key={selectedProgram.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${selectedProgram.color} mb-4`}>
                <selectedProgram.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{selectedProgram.title}</h3>
              <p className="text-gray-500 mb-4">{selectedProgram.subtitle}</p>
              <p className="text-gray-700 mb-6">{selectedProgram.description}</p>

              <div className="flex gap-4 mb-6">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-600">교육기간</span>
                  <p className="font-bold">{selectedProgram.duration}</p>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-600">취득자격</span>
                  <p className="font-bold">{selectedProgram.certification}</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-4">
                {selectedProgram.benefits.map((benefit, idx) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                      <BenefitIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 lg:p-12">
              {selectedProgram.features.map((feature, idx) => (
                <div key={idx} className="mb-8">
                  <h4 className="font-bold text-lg mb-4">{feature.title}</h4>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Curriculum */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">교육 커리큘럼</h3>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCurriculumTab('basic')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                curriculumTab === 'basic'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              기초 과정 (1-16주)
            </button>
            <button
              onClick={() => setCurriculumTab('advanced')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                curriculumTab === 'advanced'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              심화 과정 (17-32주)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">기간</th>
                  <th className="text-left py-3 px-4">이론 교육</th>
                  <th className="text-left py-3 px-4">실습 교육</th>
                </tr>
              </thead>
              <tbody>
                {curriculum[curriculumTab].map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{item.week}</td>
                    <td className="py-3 px-4">{item.content}</td>
                    <td className="py-3 px-4">{item.practical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partners */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">교육 및 협력기관</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner, idx) => {
              const Icon = partner.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-10 h-10 mx-auto mb-3 text-yellow-300" />
                  <h4 className="font-bold text-white">{partner.name}</h4>
                  <p className="text-xs mt-1 text-white/80">{partner.type}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">
            발달장애인의 미래를 함께 만들어갑니다
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            전문적인 농업 교육과 따뜻한 돌봄으로 모든 교육생이
            자립할 수 있는 전문가로 성장할 수 있도록 지원합니다
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
              교육 상담 신청
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white border-2 border-blue-600 text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors">
              브로셔 다운로드
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}