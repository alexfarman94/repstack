'use client';

import { useRunner } from './RunnerContext';
import { WorkspacePage } from './WorkspacePage';
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel';

export default function DashboardPage() {
  const { activeTab } = useRunner();

  if (activeTab === 'analytics') return <AnalyticsPanel />;
  // Settings tab will be added in Phase 9
  return <WorkspacePage />;
}
