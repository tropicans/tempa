import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function PlatformMonitoringPage() {
  return (
    <AppShell title="Monitoring" subtitle="Runtime health, AI usage, and platform signals for operators.">
      <PageCard title="System monitoring" description="Show service health, queue health, and AI latency metrics here." />
    </AppShell>
  );
}
