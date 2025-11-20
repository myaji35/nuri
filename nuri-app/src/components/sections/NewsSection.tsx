'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Award, Globe2, DollarSign, Users,
  TrendingUp, Building2, Newspaper, ArrowRight,
  Play, ExternalLink, Star, Briefcase
} from 'lucide-react';

import { getNewsItems } from '@/lib/newsStore';

const newsCategories = [
  { id: 'all', label: '전체', icon: Newspaper },
  { id: 'media', label: '언론보도', icon: Newspaper },
  { id: 'investment', label: '투자', icon: DollarSign },
  { id: 'global', label: '해외진출', icon: Globe2 },
  { id: 'award', label: '수상/인증', icon: Award },
  { id: 'partnership', label: '파트너십', icon: Users },
];

const staticNewsItems = [
  {
    id: 1,
    category: 'investment',
    type: 'major',
    date: '2024.11.10',
    title: '시리즈 B 150억원 투자 유치 성공',
    description: '글로벌 임팩트 투자사로부터 150억원 규모 시리즈 B 투자를 유치했습니다. 이번 투자금은 해외 진출과 R&D에 집중 투입될 예정입니다.',
    image: '/api/placeholder/800/600',
    tags: ['투자유치', '시리즈B', '글로벌확장'],
    link: '#',
    highlight: true
  },
  {
    id: 2,
    category: 'global',
    type: 'news',
    date: '2024.10.25',
    title: '베트남 호치민에 첫 해외 스마트팜 구축',
    description: '동남아시아 진출의 교두보로 베트남 호치민에 5,000평 규모 스마트팜을 구축하고 현지 장애인 50명을 고용했습니다.',
    image: '/api/placeholder/800/600',
    tags: ['해외진출', '베트남', '일자리창출'],
    link: '#'
  },
  {
    id: 3,
    category: 'award',
    type: 'achievement',
    date: '2024.09.15',
    title: '대한민국 ESG 경영대상 수상',
    description: '환경부와 산업통상자원부가 공동 주최한 2024 대한민국 ESG 경영대상에서 사회적가치 부문 대상을 수상했습니다.',
    image: '/api/placeholder/800/600',
    tags: ['ESG', '수상', '사회적가치'],
    link: '#'
  },
  {
    id: 4,
    category: 'partnership',
    type: 'news',
    date: '2024.08.20',
    title: '삼성전자와 스마트팜 기술 협력 MOU 체결',
    description: '삼성전자 DS부문과 AI 기반 스마트팜 고도화를 위한 기술 협력 MOU를 체결하고 공동 R&D를 시작합니다.',
    image: '/api/placeholder/800/600',
    tags: ['파트너십', '삼성전자', 'R&D'],
    link: '#'
  },
  {
    id: 5,
    category: 'award',
    type: 'achievement',
    date: '2024.07.10',
    title: 'B Corp 인증 획득',
    description: '엄격한 사회 및 환경 성과 기준을 충족하여 국내 농업 기업 최초로 B Corporation 인증을 획득했습니다.',
    image: '/api/placeholder/800/600',
    tags: ['B Corp', '인증', '지속가능경영'],
    link: '#'
  },
  {
    id: 6,
    category: 'global',
    type: 'news',
    date: '2024.06.05',
    title: '미국 캘리포니아 법인 설립',
    description: '북미 시장 진출을 위한 현지 법인을 캘리포니아에 설립하고, 실리콘밸리 기업들과의 협력을 추진합니다.',
    image: '/api/placeholder/800/600',
    tags: ['미국진출', '법인설립', '글로벌'],
    link: '#'
  }
];

const pressLogos = [
  { name: 'Forbes', logo: 'FORBES' },
  { name: 'TechCrunch', logo: 'TechCrunch' },
  { name: '조선일보', logo: '조선일보' },
  { name: 'Bloomberg', logo: 'Bloomberg' },
  { name: 'CNN', logo: 'CNN' },
];

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsItems, setNewsItems] = useState<any[]>([]);

  useEffect(() => {
    // Load news from store
    const loadedNews = getNewsItems();
    setNewsItems(loadedNews);
  }, []);

  const filteredNews = selectedCategory === 'all'
    ? newsItems
    : newsItems.filter(item => item.category === selectedCategory);

  const highlightedNews = newsItems.find(item => item.highlight);

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">
            ✦ NEWS & UPDATES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            NURI의 <span className="text-green-600">새로운 소식</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            투자 유치, 해외 진출, 수상 소식 등 NURI의 성장 스토리를 확인하세요
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {newsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Highlighted News */}
        {highlightedNews && selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                      HIGHLIGHT
                    </span>
                    <span className="text-white/80">{highlightedNews.date}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{highlightedNews.title}</h3>
                  <p className="text-white/90 mb-6">{highlightedNews.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {highlightedNews.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button className="bg-white text-gray-900 font-bold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                    자세히 보기
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative h-full min-h-[300px] lg:min-h-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/50 to-transparent z-10"></div>
                  <div className="w-full h-full bg-gray-300"></div>
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredNews.filter(item => !item.highlight || selectedCategory !== 'all').map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <div className="absolute top-4 left-4 z-20">
                  {item.category === 'media' && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      언론
                    </span>
                  )}
                  {item.category === 'investment' && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      투자
                    </span>
                  )}
                  {item.category === 'global' && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      글로벌
                    </span>
                  )}
                  {item.category === 'award' && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      수상
                    </span>
                  )}
                  {item.category === 'partnership' && (
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      협력
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-lg mb-3 group-hover:text-green-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag: string, idx: number) => (
                      <span key={idx} className="text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-green-600 hover:text-green-700 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Press Coverage */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">언론 보도</h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {pressLogos.map((press, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                {press.logo}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="bg-green-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2">
            더 많은 소식 보기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}