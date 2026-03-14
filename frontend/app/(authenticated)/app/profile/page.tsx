import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function ProfilePage() {
  return (
    <AppShell title="Profile" subtitle="Shared authenticated profile screen.">
      <PageCard title="User profile" description="Show role assignments, institution, and account settings here." />
    </AppShell>
  );
}
