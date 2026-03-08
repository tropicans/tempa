import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';

export default function DesignPage() {
  return (
    <AppShell title="Design" subtitle="Generate options and compare interventions.">
      <PhaseWorkspace phase="Design">
        <PageCard title="Decision options" description="Render 3 to 5 options with benefits, risks, and trade-offs." />
        <PageCard title="Selection" description="Support preferred option selection and mentor validation." />
      </PhaseWorkspace>
    </AppShell>
  );
}
