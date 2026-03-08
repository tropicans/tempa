import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';

export default function ImplementationPage() {
  return (
    <AppShell title="Implementation" subtitle="Track progress, upload evidence, and record impact.">
      <PhaseWorkspace phase="Implementation">
        <PageCard title="Progress log" description="Capture progress percent, status notes, and risks." />
        <PageCard title="Impact metrics" description="Record baseline, target, actual, and linked evidence." />
      </PhaseWorkspace>
    </AppShell>
  );
}
