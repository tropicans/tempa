import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
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
    <AppShell title="Participant Dashboard" subtitle="Track projects, phase progress, and TAI growth." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Today at a glance</div>
          <h2 className="hero-title">Bangun solusi organisasi, bukan sekadar menyelesaikan modul.</h2>
          <p className="muted">
            Dashboard ini merangkum fase proyek aktif, kemajuan evidence, dan sinyal TAI terakhir agar kamu tahu apa yang harus dikerjakan berikutnya.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/app/participant/projects">Open project workspace</Link>
            <Link className="button secondary" href="/app/participant/projects">Create or continue project</Link>
          </div>
        </div>
        <div className="metric-strip">
          <div className="metric-card">
            <div className="metric-label">Active projects</div>
            <div className="metric-value">{dashboard.activeProjectCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Current phase</div>
            <div className="metric-value">{dashboard.currentPhase}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Latest TAI</div>
            <div className="metric-value">{dashboard.latestTaiScore ? dashboard.latestTaiScore.totalTaiScore : '--'}</div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Project signal" title="Current momentum" description="Use this to understand where your project needs the next push.">
          <div className="stack">
            <div className="signal-box">
              <strong>Phase checkpoint</strong>
              <p className="muted">You are currently in the {dashboard.currentPhase} phase. Focus on preparing the next validated artifact.</p>
            </div>
            <Link className="nav-link" href="/app/participant/projects">Go to project list</Link>
          </div>
        </PageCard>
        <PageCard eyebrow="Evidence" title="TAI readiness" description="Score visibility improves once implementation evidence and reflection are complete.">
          <div className="stack">
            <p className="stat">{dashboard.latestTaiScore ? dashboard.latestTaiScore.totalTaiScore : 'No score yet'}</p>
            <p className="muted">If no score is published yet, continue building evidence and submit your reflection for mentor review.</p>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
