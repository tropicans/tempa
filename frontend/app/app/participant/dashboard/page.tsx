import Link from 'next/link';
import { LayoutDashboard, FolderKanban, Target, TrendingUp } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ParticipantDashboard = {
  activeProjectCount: number;
  currentPhase: string;
  latestTaiScore: { totalTaiScore: number } | null;
};

export default async function ParticipantDashboardPage() {
  const role = await getSessionRole();
  const dashboard = await fetchSessionJson<ParticipantDashboard>('/dashboard/participant').catch(() => ({
    activeProjectCount: 0,
    currentPhase: 'analysis',
    latestTaiScore: null,
  }));

  return (
    <AppShell
      title="Participant Dashboard"
      subtitle="Track projects, phase progress, and TAI growth."
      roleLabel={role}
      icon={<LayoutDashboard size={22} />}
      stats={
        <>
          <div className="compact-stat">
            <div className="compact-stat-value">{dashboard.activeProjectCount}</div>
            <div className="compact-stat-label">Projects</div>
          </div>
          <div className="compact-stat">
            <div className="compact-stat-value" style={{ textTransform: 'capitalize' }}>{dashboard.currentPhase}</div>
            <div className="compact-stat-label">Phase</div>
          </div>
          <div className="compact-stat">
            <div className="compact-stat-value">{dashboard.latestTaiScore?.totalTaiScore ?? '--'}</div>
            <div className="compact-stat-label">TAI</div>
          </div>
        </>
      }
    >
      <div className="metric-strip">
        <AccentCard label="Current focus" value={dashboard.currentPhase} />
        <StatCard label="Active projects" value={dashboard.activeProjectCount} icon={<FolderKanban size={16} />} />
        <StatCard label="Latest TAI" value={dashboard.latestTaiScore?.totalTaiScore ?? 'No score'} icon={<Target size={16} />} />
      </div>

      <div className="grid grid-3">
        <PageCard eyebrow="Project signal" title="Current momentum" description="Where your project needs the next push.">
          <div className="stack">
            <div className="signal-box">
              <strong>Phase checkpoint</strong>
              <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>
                You are in the <strong>{dashboard.currentPhase}</strong> phase. Focus on preparing the next validated artifact.
              </p>
            </div>
            <Link className="button secondary" href="/app/participant/projects" style={{ width: 'fit-content' }}>
              <FolderKanban size={16} /> Go to projects
            </Link>
          </div>
        </PageCard>

        <PageCard eyebrow="Evidence" title="TAI readiness" description="Score visibility improves once evidence and reflection are complete.">
          <div className="stack" style={{ alignItems: 'center' }}>
            <p className="stat">{dashboard.latestTaiScore?.totalTaiScore ?? '--'}</p>
            <p className="muted" style={{ fontSize: 'var(--text-sm)', textAlign: 'center' }}>
              Continue building evidence and submit your reflection for mentor review.
            </p>
          </div>
        </PageCard>

        <PageCard eyebrow="Next action" title="Recommended sequence" description="Follow this pattern for consistent progress.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><h3 style={{ fontSize: 'var(--text-base)' }}>Review active project</h3><p className="muted" style={{ fontSize: 'var(--text-sm)' }}>Scan latest feedback before editing.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><h3 style={{ fontSize: 'var(--text-base)' }}>Complete the deliverable</h3><p className="muted" style={{ fontSize: 'var(--text-sm)' }}>Focus on the artifact that unblocks the next checkpoint.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><h3 style={{ fontSize: 'var(--text-base)' }}>Submit when ready</h3><p className="muted" style={{ fontSize: 'var(--text-sm)' }}>Use reflection and metrics for quality.</p></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
