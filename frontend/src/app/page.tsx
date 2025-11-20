'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
          누리팜 스마트팜
        </h1>
        <p className="text-slate-600 dark:text-slate-300">대시보드로 이동 중...</p>
      </div>
    </div>
  );
}
