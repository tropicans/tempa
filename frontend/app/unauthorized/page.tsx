import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function UnauthorizedPage() {
  return (
    <AppShell title="Unauthorized" subtitle="This placeholder screen is shown when a role cannot access a route.">
      <PageCard title="Access denied" description="Replace this with your final role-aware guard messaging." />
    </AppShell>
  );
}
