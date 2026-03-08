import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function AdminCohortMentorsPage() {
  return (
    <AppShell title="Mentor Assignment" subtitle="Assign mentors to participants and review load distribution.">
      <PageCard title="Mentor assignments" description="Render assignment matrix and balancing actions here." />
    </AppShell>
  );
}
