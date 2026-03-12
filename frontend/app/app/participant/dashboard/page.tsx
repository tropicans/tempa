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
      <section className="hero-banner card">
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
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card">
            <div className="metric-label">Current focus</div>
            <div className="metric-value">{dashboard.currentPhase}</div>
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
        </div>
      </section>
      <div className="grid grid-3">
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
        <PageCard eyebrow="Next action" title="Recommended sequence" description="Use one stable pattern so you always know the next move.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><h3>Review your active project</h3><p className="muted">Open the current workspace and scan the latest feedback before editing.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><h3>Complete the phase deliverable</h3><p className="muted">Focus on the single artifact that unblocks the next mentor checkpoint.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><h3>Submit when evidence is ready</h3><p className="muted">Use reflection and metrics to strengthen the quality of your final submission.</p></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
