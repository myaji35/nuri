'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Newspaper, Users, Settings,
  BookOpen, DollarSign, ChevronRight, LogOut,
  Menu, X, ChevronLeft, Milestone, Building2,
  Cpu, Microscope, Shield
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    title: '대시보드',
    icon: LayoutDashboard,
    href: '/admin'
  },
  {
    title: '소식 관리',
    icon: Newspaper,
    href: '/admin/news'
  },
  {
    title: 'Journey 관리',
    icon: Milestone,
    href: '/admin/journey'
  },
  {
    title: '사업장 관리',
    icon: Building2,
    href: '/admin/workplace'
  },
  {
    title: '혁신기술 관리',
    icon: Cpu,
    href: '/admin/technology'
  },
  {
    title: 'R&D 프로젝트',
    icon: Microscope,
    href: '/admin/rd-projects'
  },
  {
    title: '특허&IP 관리',
    icon: Shield,
    href: '/admin/patents'
  },
  {
    title: '수익 관리',
    icon: DollarSign,
    href: '/admin/revenue'
  },
  {
    title: '교육 관리',
    icon: BookOpen,
    href: '/admin/education'
  },
  {
    title: '조직 관리',
    icon: Users,
    href: '/admin/organization'
  },
  {
    title: '설정',
    icon: Settings,
    href: '/admin/settings'
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b fixed top-0 left-0 right-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-md shadow-sm"></div>
              <span className="font-bold text-lg">NURI Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">관리자</span>
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block fixed left-0 top-14 bottom-0 bg-white border-r transition-all duration-200 ${
            sidebarCollapsed ? 'w-14' : 'w-48'
          }`}
        >
          {/* Dashboard Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors border-b ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Dashboard 펼치기' : 'Dashboard 접기'}
          >
            <LayoutDashboard className="w-4 h-4 text-gray-700 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-semibold text-gray-900">Dashboard</span>
            )}
            {!sidebarCollapsed && (
              <ChevronLeft className="w-3.5 h-3.5 ml-auto text-gray-400" />
            )}
          </button>

          <nav className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-md transition-colors mb-0.5 group relative ${
                    isActive
                      ? 'bg-green-50 text-green-600 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={sidebarCollapsed ? item.title : ''}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="text-sm transition-opacity duration-150">{item.title}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                    </>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-1.5 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileSidebarOpen(false)}
            ></div>
            <aside className="lg:hidden fixed left-0 top-14 bottom-0 w-48 bg-white border-r z-50 shadow-lg">
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-md transition-colors mb-0.5 ${
                        isActive
                          ? 'bg-green-50 text-green-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-200 ${
            sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-48'
          } ml-0`}
        >
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}