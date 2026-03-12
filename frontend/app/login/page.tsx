import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function LoginPage() {
  return (
    <main className="shell landing-shell subtle-grid">
      <AppShell title="TEMPA access" subtitle="A calmer, more navigable enterprise workspace inspired by modern analytics products.">
        <section className="hero-banner card">
          <div className="hero-copy">
            <div className="section-eyebrow">Single sign-on</div>
            <h2 className="hero-title">Masuk ke workspace yang lebih sederhana, bersih, dan mudah dibaca.</h2>
            <p className="muted">
              Untuk saat ini akses masih memakai role demo. Nantinya area ini bisa langsung diganti menjadi SSO institusi tanpa mengubah struktur experience utama.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/login/as/participant">
                Masuk sebagai participant
              </Link>
              <Link className="button secondary" href="/login/as/mentor">
                Coba mentor view
              </Link>
            </div>
          </div>
          <div className="hero-panel-surface stack">
            <div className="metric-card accent-card">
              <div className="metric-label">Experience direction</div>
              <div className="metric-value">Clean enterprise</div>
            </div>
            <div className="metric-strip">
              <div className="metric-card">
                <div className="metric-label">Auth today</div>
                <div className="metric-value">Role switch</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Access model</div>
                <div className="metric-value">RBAC</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Future</div>
                <div className="metric-value">SSO</div>
              </div>
            </div>
          </div>
        </section>

        <PageCard eyebrow="Demo roles" title="Choose a workspace" description="Each role opens into a dedicated navigation model designed for its primary responsibilities.">
          <div className="grid grid-3">
            <Link className="feature-tile" href="/login/as/participant">
              <div className="feature-kicker">Participant</div>
              <strong>Drive project progress</strong>
              <span className="muted">Move from analysis to evaluation with a focused phase workspace and clear next actions.</span>
            </Link>
            <Link className="feature-tile" href="/login/as/mentor">
              <div className="feature-kicker">Mentor</div>
              <strong>Review with confidence</strong>
              <span className="muted">See review queues, pending checkpoints, and project context in one cleaner flow.</span>
            </Link>
            <Link className="feature-tile" href="/login/as/program_admin">
              <div className="feature-kicker">Program admin</div>
              <strong>Run program operations</strong>
              <span className="muted">Manage programs, cohorts, and setup tasks without losing governance visibility.</span>
            </Link>
            <Link className="feature-tile" href="/login/as/executive_viewer">
              <div className="feature-kicker">Executive</div>
              <strong>Read portfolio health fast</strong>
              <span className="muted">Focus on strategic outcomes, implementation momentum, and talent indicators.</span>
            </Link>
            <Link className="feature-tile" href="/login/as/platform_operator">
              <div className="feature-kicker">Operator</div>
              <strong>Keep the platform reliable</strong>
              <span className="muted">Monitor health, audit changes, and maintain support workflows from one place.</span>
            </Link>
          </div>
        </PageCard>
      </AppShell>
    </main>
  );
}
