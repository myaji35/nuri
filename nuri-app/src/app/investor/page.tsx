'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IncomeFlowChart from '@/components/sections/IncomeFlowChart';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

export default function InvestorPage() {
  const financialHighlights = [
    {
      icon: TrendingUp,
      title: '매출 성장률',
      value: '320%',
      period: 'YoY',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: DollarSign,
      title: '연간 매출',
      value: '250억',
      period: '2024년',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: '누적 투자 유치',
      value: '120억',
      period: 'Series B',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Target,
      title: '기업가치',
      value: '500억',
      period: '현재',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const investmentRounds = [
    {
      round: 'Seed',
      amount: '10억원',
      date: '2020.03',
      investors: '엔젤투자자, 소셜벤처펀드'
    },
    {
      round: 'Series A',
      amount: '30억원',
      date: '2021.08',
      investors: '벤처캐피탈, 임팩트투자사'
    },
    {
      round: 'Series B',
      amount: '80억원',
      date: '2023.05',
      investors: '대형 VC, 전략적 투자자'
    },
    {
      round: 'Series C',
      amount: '계획중',
      date: '2025 Q2',
      investors: '글로벌 투자자 유치 예정'
    }
  ];

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                ✦ INVESTOR RELATIONS
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
                지속 성장하는 <span className="text-indigo-600">투자 가치</span>
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                사회적 가치와 경제적 성과를 동시에 달성하는
                NURI의 성장 스토리를 확인하세요.
              </p>
            </motion.div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {financialHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{item.title}</div>
                    <div className="text-3xl font-bold mb-1">{item.value}</div>
                    <div className="text-sm text-gray-600">{item.period}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Revenue Model Section */}
        <IncomeFlowChart />

        {/* Investment History */}
        <section id="investment" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">투자 유치 현황</h2>
              <p className="text-gray-600">NURI의 성장을 함께한 투자자들</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>

                {/* Investment Rounds */}
                <div className="space-y-8">
                  {investmentRounds.map((round, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-20"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-6 top-6 w-5 h-5 bg-white border-4 border-indigo-500 rounded-full"></div>

                      {/* Content Card */}
                      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-indigo-600">{round.round}</h3>
                            <p className="text-gray-500 text-sm">{round.date}</p>
                          </div>
                          <div className="text-3xl font-bold mt-2 md:mt-0">{round.amount}</div>
                        </div>
                        <p className="text-gray-600">
                          <span className="font-semibold">투자자:</span> {round.investors}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Invest Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">투자 매력 포인트</h2>
              <p className="text-gray-600">NURI가 특별한 이유</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-4xl font-bold text-green-600 mb-4">3배</div>
                <h3 className="text-xl font-bold mb-2">빠른 성장</h3>
                <p className="text-gray-600">연평균 매출 성장률 300% 이상 달성</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">1위</div>
                <h3 className="text-xl font-bold mb-2">시장 리더십</h3>
                <p className="text-gray-600">소셜 임팩트 스마트팜 분야 국내 1위</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-4">10개국</div>
                <h3 className="text-xl font-bold mb-2">글로벌 확장</h3>
                <p className="text-gray-600">2025년까지 10개국 진출 목표</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}