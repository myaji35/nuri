'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const footerLinks = {
    company: [
      { label: '회사 소개', href: '/about' },
      { label: '연혁', href: '/about#journey' },
      { label: '조직도', href: '/about#organization' },
      { label: '오시는 길', href: '/about#location' },
    ],
    business: [
      { label: '스마트팜', href: '/business#smartfarm' },
      { label: '글로벌 사업장', href: '/business#global' },
      { label: '원스톱 솔루션', href: '/business#solution' },
    ],
    innovation: [
      { label: '핵심기술', href: '/innovation#technology' },
      { label: 'R&D', href: '/innovation#rd' },
      { label: '특허 & IP', href: '/innovation#patent' },
    ],
    social: [
      { label: '교육 프로그램', href: '/social#education' },
      { label: '장애인 고용', href: '/social#employment' },
      { label: 'ESG 경영', href: '/social#esg' },
    ],
    support: [
      { label: '공지사항', href: '/news' },
      { label: 'FAQ', href: '/support#faq' },
      { label: '문의하기', href: '/support#contact' },
      { label: '파트너십', href: '/support#partnership' },
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              <span className="font-bold text-xl">NURI</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              발달장애인과 함께 성장하며, 스마트팜 기술로 농업의 미래를 혁신하고,
              지속가능한 사회적 가치를 창출하는 글로벌 소셜 벤처
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold text-sm mb-4">회사</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-4">사업</h3>
            <ul className="space-y-2">
              {footerLinks.business.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-4">기술혁신</h3>
            <ul className="space-y-2">
              {footerLinks.innovation.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-4">지원</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-gray-800">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">문의하기</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-300">02-1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-300">contact@nuri.co.kr</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-300">서울특별시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">뉴스레터 구독</h3>
            <p className="text-gray-400 mb-4 text-sm">최신 소식과 업데이트를 받아보세요</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소"
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                구독하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 NURI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                이용약관
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                사이트맵
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}