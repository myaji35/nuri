'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Globe, User, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

export default function Header() {
  const { locale, setLocale, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

// 메뉴 구조 정의
const menuStructure = [
  {
    label: t.nav.about,
    href: '/about',
    submenu: [
      { label: '회사 소개', href: '/about#company' },
      { label: 'Our Journey', href: '/about#journey' },
      { label: '사업장 코드', href: '/about#workplace-code' },
    ]
  },
  {
    label: t.nav.business,
    href: '/business',
    submenu: [
      { label: '스마트팜', href: '/business#smartfarm' },
      { label: '원스톱 솔루션', href: '/business#solution' },
      { label: '글로벌 사업장', href: '/business#global' },
    ]
  },
  {
    label: t.nav.innovation,
    href: '/innovation',
    submenu: [
      { label: '핵심기술', href: '/innovation#technology' },
      { label: 'R&D 프로젝트', href: '/innovation#rd' },
      { label: '특허 & IP', href: '/innovation#patent' },
    ]
  },
  {
    label: t.nav.social,
    href: '/social',
    submenu: [
      { label: '교육 프로그램', href: '/social#education' },
      { label: '장애인 고용', href: '/social#employment' },
      { label: 'ESG 경영', href: '/social#esg' },
    ]
  },
  {
    label: t.nav.investor,
    href: '/investor',
    submenu: [
      { label: '수익모델', href: '/investor#revenue' },
      { label: '투자 유치', href: '/investor#investment' },
      { label: '재무정보', href: '/investor#financial' },
    ]
  },
  {
    label: t.nav.news,
    href: '/news',
  },
];

  return (
    <>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full"></div>
            <span className="font-bold text-xl">NURI</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuStructure.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.submenu && setActiveSubmenu(item.label)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600 py-2 transition-colors font-medium"
                >
                  {item.label}
                  {item.submenu && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Link>

                {/* Submenu Dropdown */}
                {item.submenu && activeSubmenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px]"
                  >
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}

            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{locale.toUpperCase()}</span>
            </button>

            {/* User Menu or Login Button */}
            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  <User className="w-5 h-5" />
                  <span>{user?.name || user?.email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px]"
                  >
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      {t.nav.dashboard}
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <LogIn className="w-5 h-5" />
                <span>{t.nav.login}</span>
              </button>
            )}

            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              {t.nav.contact}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {menuStructure.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => !item.submenu && setMobileMenuOpen(false)}
                      className="flex-1 py-3 text-gray-700 hover:text-green-600 font-medium"
                    >
                      {item.label}
                    </Link>
                    {item.submenu && (
                      <button
                        onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
                        className="p-2"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            activeSubmenu === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  {item.submenu && activeSubmenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 space-y-1"
                    >
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.label}
                          href={subitem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 text-sm text-gray-600 hover:text-green-600"
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Mobile Language Switcher */}
              <button
                onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
                className="flex items-center gap-3 py-3 text-gray-700 hover:text-green-600 font-medium w-full"
              >
                <Globe className="w-5 h-5" />
                <span>{locale === 'ko' ? '한국어' : 'English'}</span>
              </button>

              {/* Mobile User Menu or Login */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-gray-700 hover:text-green-600 font-medium w-full"
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.name || user?.email}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 font-semibold mt-2 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-semibold mt-2 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  {t.nav.login}
                </button>
              )}

              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-2">
                {t.nav.contact}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}