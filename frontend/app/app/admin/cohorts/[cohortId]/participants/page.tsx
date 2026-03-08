import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function AdminCohortParticipantsPage() {
  return (
    <AppShell title="Participant Enrollment" subtitle="Enroll and monitor cohort participants.">
      <PageCard title="Enrollments" description="Render participant list, search, and enrollment actions." />
    </AppShell>
  );
}
