import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function HomePage() {
  return (
    <AppShell title="TEMPA Workspace" subtitle="AI-augmented project-based learning for public sector capability development.">
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">AI-ready learning platform</div>
          <h2 className="hero-title">Dari problem organisasi ke keputusan, aksi, dan evidence.</h2>
          <p className="muted">
            TEMPA membawa pola interaksi product-first ala `ngodingpakeai.com` ke konteks pembelajaran ASN:
            cepat, jelas, modular, dan fokus ke action.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/login">Masuk ke workspace</Link>
            <Link className="button secondary" href="/app/participant/dashboard">Lihat participant flow</Link>
          </div>
        </div>
        <div className="metric-strip">
          <div className="metric-card">
            <div className="metric-label">Learning model</div>
            <div className="metric-value">ADDIE</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">AI posture</div>
            <div className="metric-value">Human-in-loop</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Core output</div>
            <div className="metric-value">TAI</div>
          </div>
        </div>
      </section>
      <PageCard eyebrow="Starter routes" title="Choose a workspace" description="Jump into role-based screens in the generated skeleton.">
        <div className="grid grid-3">
          <Link className="feature-tile" href="/login">
            <div className="feature-kicker">Login</div>
            <strong>Role switch entry</strong>
            <span className="muted">Try participant, mentor, admin, executive, or operator mode.</span>
          </Link>
          <Link className="feature-tile" href="/app/participant/dashboard">
            <div className="feature-kicker">Participant</div>
            <strong>Project workspace</strong>
            <span className="muted">Move from analysis to evaluation with AI and mentor checkpoints.</span>
          </Link>
          <Link className="feature-tile" href="/app/mentor/dashboard">
            <div className="feature-kicker">Mentor</div>
            <strong>Review flow</strong>
            <span className="muted">Monitor queue, validate submissions, and guide project quality.</span>
          </Link>
        </div>
      </PageCard>
    </AppShell>
  );
}
