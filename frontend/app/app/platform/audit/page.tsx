import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function PlatformAuditPage() {
  return (
    <AppShell title="Audit Explorer" subtitle="Operational audit trail viewer for controlled support access.">
      <PageCard title="Audit log" description="Show critical transitions, approvals, and override records here." />
    </AppShell>
  );
}
