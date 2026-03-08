import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';

export default function EvaluationPage() {
  return (
    <AppShell title="Evaluation" subtitle="Submit reflection and review TAI score evidence.">
      <PhaseWorkspace phase="Evaluation">
        <PageCard title="Reflection journal" description="Submit participant reflection with AI analysis support." />
        <PageCard title="TAI evidence" description="Show scoring breakdown and mentor assessment status." />
      </PhaseWorkspace>
    </AppShell>
  );
}
