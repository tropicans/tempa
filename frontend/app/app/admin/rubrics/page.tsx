import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function AdminRubricsPage() {
  return (
    <AppShell title="Rubrics" subtitle="Configure assessment rubrics and scoring versions.">
      <PageCard title="Rubric configuration" description="This route can remain hidden until rubric UI is included in MVP." />
    </AppShell>
  );
}
