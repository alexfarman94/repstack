'use client';

import { useRunner } from './RunnerContext';
import { WorkspacePage } from './WorkspacePage';
import { AnalyticsPanel } from '@/components/analytics/AnalyticsPanel';
import { SettingsPanel } from '@/components/settings/SettingsPanel';

export default function DashboardPage() {
  const { activeTab } = useRunner();

  if (activeTab === 'analytics') return <AnalyticsPanel />;
  if (activeTab === 'settings') return <SettingsPanel />;
  return <WorkspacePage />;
}
