/**
 * Dashboard Main Page
 * 대시보드 메인 페이지 - 5개 탭 통합
 */

'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TabNavigation from '@/components/dashboard/TabNavigation';
import FacilityMonitoring from '@/components/dashboard/facility/FacilityMonitoring';
import SmartFarmTwin from '@/components/dashboard/twin/SmartFarmTwin';
import EnvironmentalMonitoring from '@/components/dashboard/environmental/EnvironmentalMonitoring';
import MarketOptimization from '@/components/dashboard/market/MarketOptimization';
import CropManagement from '@/components/dashboard/crop/CropManagement';
import { useDashboardStore } from '@/stores/useDashboardStore';

export default function DashboardPage() {
  const activeTab = useDashboardStore((state) => state.activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'facility':
        return <FacilityMonitoring />;
      case 'twin':
        return <SmartFarmTwin />;
      case 'environmental':
        return <EnvironmentalMonitoring />;
      case 'market':
        return <MarketOptimization />;
      case 'crop':
        return <CropManagement />;
      default:
        return <FacilityMonitoring />;
    }
  };

  return (
    <DashboardLayout title="누리팜 종합 대시보드">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <TabNavigation />

        {/* Dashboard Content */}
        <div className="transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
