import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
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
          <AccentCard label="Active rubric" value="v1" />
          <div className="metric-strip">
            <StatCard label="Dimensions" value={4} />
            <StatCard label="Versioning" value="Tracked" />
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
