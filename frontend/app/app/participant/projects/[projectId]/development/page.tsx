import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';

export default function DevelopmentPage() {
  return (
    <AppShell title="Development" subtitle="Draft implementation roadmap, KPIs, and risk register.">
      <PhaseWorkspace phase="Development">
        <PageCard title="Implementation plan" description="Roadmap, milestones, KPIs, and risk register editor." />
      </PhaseWorkspace>
    </AppShell>
  );
}
