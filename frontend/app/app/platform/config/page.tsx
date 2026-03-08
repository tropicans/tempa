import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function PlatformConfigPage() {
  return (
    <AppShell title="Platform Config" subtitle="Operational configuration view for platform operators.">
      <PageCard title="Configuration" description="Resolve prompt policies, feature flags, and system settings here." />
    </AppShell>
  );
}
