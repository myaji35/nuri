'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Globe, Building, MapPin, Hash, Sparkles } from 'lucide-react';

// 알파벳별 국가 데이터
const countryData = {
  A: ['Australia (호주)', 'Argentina (아르헨티나)', 'Austria (오스트리아)'],
  B: ['Brazil (브라질)', 'Belgium (벨기에)', 'Bangladesh (방글라데시)'],
  C: ['Canada (캐나다)', 'China (중국)', 'Chile (칠레)'],
  D: ['Denmark (덴마크)', 'Deutschland (독일)', 'Dubai (두바이)'],
  E: ['Egypt (이집트)', 'England (영국)', 'Ecuador (에콰도르)'],
  F: ['France (프랑스)', 'Finland (핀란드)', 'Fiji (피지)'],
  G: ['Germany (독일)', 'Greece (그리스)', 'Ghana (가나)'],
  H: ['Hungary (헝가리)', 'Hong Kong (홍콩)', 'Honduras (온두라스)'],
  I: ['India (인도)', 'Indonesia (인도네시아)', 'Italy (이탈리아)'],
  J: ['Japan (일본)', 'Jordan (요르단)', 'Jamaica (자메이카)'],
  K: ['Korea (한국)', 'Kenya (케냐)', 'Kuwait (쿠웨이트)'],
  L: ['Luxembourg (룩셈부르크)', 'Lebanon (레바논)', 'Libya (리비아)'],
  M: ['Mexico (멕시코)', 'Malaysia (말레이시아)', 'Morocco (모로코)'],
  N: ['Netherlands (네덜란드)', 'Norway (노르웨이)', 'New Zealand (뉴질랜드)'],
  O: ['Oman (오만)', 'Osaka (오사카)', 'Ontario (온타리오)'],
  P: ['Philippines (필리핀)', 'Poland (폴란드)', 'Portugal (포르투갈)'],
  Q: ['Qatar (카타르)', 'Quebec (퀘벡)', 'Queensland (퀸즈랜드)'],
  R: ['Russia (러시아)', 'Romania (루마니아)', 'Rwanda (르완다)'],
  S: ['Singapore (싱가포르)', 'Spain (스페인)', 'Sweden (스웨덴)'],
  T: ['Thailand (태국)', 'Turkey (터키)', 'Taiwan (대만)'],
  U: ['USA (미국)', 'UAE (아랍에미리트)', 'Uganda (우간다)'],
  V: ['Vietnam (베트남)', 'Venezuela (베네수엘라)', 'Vatican (바티칸)'],
  W: ['Wales (웨일스)', 'Washington (워싱턴)', 'Warsaw (바르샤바)'],
  X: ['Xiamen (샤먼)', 'Xian (시안)', 'Xinjiang (신장)'],
  Y: ['Yemen (예멘)', 'Yokohama (요코하마)', 'Yangon (양곤)'],
  Z: ['Zimbabwe (짐바브웨)', 'Zambia (잠비아)', 'Zurich (취리히)']
};

const codeComponents = [
  {
    part: 'K1',
    label: '국가코드',
    description: 'K로 시작하는 첫 번째 국가',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    part: 'NURI',
    label: '브랜드',
    description: '누리 브랜드 식별자',
    icon: Sparkles,
    color: 'from-green-500 to-emerald-500'
  },
  {
    part: 'farm',
    label: '사업유형',
    description: 'farm(농장) 또는 shop(매장)',
    icon: Building,
    color: 'from-purple-500 to-pink-500'
  },
  {
    part: '01',
    label: '순번',
    description: '해당 유형의 1번째 사업장',
    icon: Hash,
    color: 'from-orange-500 to-red-500'
  }
];

export default function WorkplaceCodeSection() {
  const [currentLetter, setCurrentLetter] = useState('A');
  const [showCountries, setShowCountries] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState<number | null>(null);

  useEffect(() => {
    // 알파벳 순환 애니메이션
    const interval = setInterval(() => {
      setCurrentLetter((prev) => {
        const nextChar = String.fromCharCode(prev.charCodeAt(0) + 1);
        if (nextChar > 'Z') return 'A';
        return nextChar;
      });
      setShowCountries(true);
      setTimeout(() => setShowCountries(false), 2500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
            ✦ WORKPLACE CODE SYSTEM
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            글로벌 사업장 <span className="text-green-600">코드 체계</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            NURI의 체계적인 사업장 관리를 위한 고유 식별 코드 시스템
          </p>
        </motion.div>

        {/* Code Example Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <Code className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold">사업장 코드 예시</h3>
          </div>

          {/* Code Breakdown */}
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center text-3xl md:text-4xl font-mono font-bold text-white">
              {codeComponents.map((comp, idx) => (
                <motion.span
                  key={idx}
                  className="relative cursor-pointer"
                  onHoverStart={() => setHoveredComponent(idx)}
                  onHoverEnd={() => setHoveredComponent(null)}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className={`${hoveredComponent === idx ? 'text-yellow-400' : ''}`}>
                    {comp.part}
                  </span>
                  {hoveredComponent === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: -60 }}
                      className="absolute left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 whitespace-nowrap z-10"
                    >
                      <div className="text-sm font-semibold text-gray-900">{comp.label}</div>
                      <div className="text-xs text-gray-600 font-normal">{comp.description}</div>
                    </motion.div>
                  )}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {codeComponents.map((comp, idx) => {
              const Icon = comp.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${comp.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-mono font-bold text-lg mb-1">{comp.part}</div>
                  <div className="text-sm font-semibold text-gray-700">{comp.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{comp.description}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Alphabet Animation Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12 max-w-6xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center mb-8">국가 코드 체계</h3>

          <div className="relative h-64 flex items-center justify-center">
            {/* Falling Letter Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLetter}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute"
              >
                <div className="text-8xl md:text-9xl font-bold text-green-600">
                  {currentLetter}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Countries Display */}
            <AnimatePresence>
              {showCountries && countryData[currentLetter as keyof typeof countryData] && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 200, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-1/2 ml-20"
                >
                  <div className="space-y-2">
                    {countryData[currentLetter as keyof typeof countryData].map((country, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-medium text-gray-700">{country}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                animate={{
                  width: `${((currentLetter.charCodeAt(0) - 65) / 25) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>A</span>
              <span>Z</span>
            </div>
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="font-mono font-bold text-lg mb-2">K1NURIfarm01</div>
            <div className="text-sm text-gray-600">한국 첫 번째 스마트팜</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="font-mono font-bold text-lg mb-2">S1NURIshop01</div>
            <div className="text-sm text-gray-600">싱가포르 첫 번째 매장</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="font-mono font-bold text-lg mb-2">V2NURIfarm03</div>
            <div className="text-sm text-gray-600">베트남 두 번째 국가, 3번 농장</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}