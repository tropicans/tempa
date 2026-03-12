import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminRubricsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Rubrics" subtitle="Configure assessment rubrics and scoring versions." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Assessment design</div>
          <h2 className="hero-title">Kelola scoring framework tanpa membuat konfigurasi terasa teknis dan berat.</h2>
          <p className="muted">Rubric management harus menjelaskan versioning, dimensions, dan governance secara sederhana.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Active rubric</div><div className="metric-value">v1</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Dimensions</div><div className="metric-value">4</div></div>
            <div className="metric-card"><div className="metric-label">Versioning</div><div className="metric-value">Tracked</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Rubric configuration" description="This route can remain hidden until rubric UI is included in MVP." />
        <PageCard title="Design principle" description="When this UI becomes active, lead with readability of dimensions and scoring intent before advanced controls." />
      </div>
    </AppShell>
  );
}
