import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function ExecutiveProjectsPage() {
  return (
    <AppShell title="Approved Projects" subtitle="Portfolio view for leadership and strategic stakeholders.">
      <PageCard title="Project portfolio" description="Show approved projects only, with restricted detail." />
    </AppShell>
  );
}
