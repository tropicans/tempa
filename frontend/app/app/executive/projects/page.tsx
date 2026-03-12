import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function ExecutiveProjectsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Approved Projects" subtitle="Portfolio view for leadership and strategic stakeholders." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Portfolio lens</div>
          <h2 className="hero-title">Pantau proyek yang sudah matang tanpa terseret ke detail taktikal.</h2>
          <p className="muted">Portfolio page harus menampilkan outcomes, momentum, dan high-level risk in a very scannable form.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Approved projects</div><div className="metric-value">12</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">On track</div><div className="metric-value">9</div></div>
            <div className="metric-card"><div className="metric-label">Needs attention</div><div className="metric-value">3</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Project portfolio" description="Show approved projects only, with restricted detail." />
        <PageCard title="Reading pattern" description="Executives should be able to spot priority projects in seconds using strong status summaries and concise outcome language." />
      </div>
    </AppShell>
  );
}
