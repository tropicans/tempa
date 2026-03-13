import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Target } from 'lucide-react';

import { AccentCard } from '@/components/accent-card';
import { StatCard } from '@/components/stat-card';

export default function HomePage() {
  return (
    <div className="shell landing-shell subtle-grid">
      <section className="page-shell stack" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        {/* Hero */}
        <header className="stack" style={{ gap: '20px', padding: '40px 0 20px', animation: 'fadeUp 0.5s ease both' }}>
          <div className="pill" style={{ margin: '0 auto' }}>AI-ready learning platform</div>
          <h1 className="hero-title" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Dari problem organisasi ke keputusan, aksi, dan evidence.
          </h1>
          <p className="muted" style={{ maxWidth: '560px', margin: '0 auto', fontSize: 'var(--text-md)' }}>
            TEMPA membawa pola interaksi product-first ke konteks pembelajaran ASN:
            cepat, jelas, modular, dan fokus ke action.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link className="button" href="/login">
              Masuk ke workspace <ArrowRight size={16} />
            </Link>
            <Link className="button secondary" href="/app/participant/dashboard">
              Lihat participant flow
            </Link>
          </div>
        </header>

        {/* Stats strip */}
        <div className="metric-strip" style={{ animation: 'fadeUp 0.5s ease 0.15s both' }}>
          <AccentCard label="Learning model" value="ADDIE" />
          <StatCard label="AI posture" value="Human-in-loop" icon={<Sparkles size={16} />} />
          <StatCard label="Core output" value="TAI Score" icon={<Target size={16} />} />
        </div>

        {/* Feature tiles */}
        <div style={{ animation: 'fadeUp 0.5s ease 0.3s both' }}>
          <div style={{ textAlign: 'left', marginBottom: '16px' }}>
            <div className="section-eyebrow">Starter routes</div>
            <h2 style={{ fontSize: 'var(--text-xl)' }}>Choose a workspace</h2>
            <p className="muted">Jump into role-based screens in the generated skeleton.</p>
          </div>
          <div className="grid grid-3">
            <Link className="feature-tile" href="/login">
              <div className="feature-kicker">Login</div>
              <strong>Role switch entry</strong>
              <span className="muted" style={{ fontSize: 'var(--text-sm)' }}>Try participant, mentor, admin, executive, or operator mode.</span>
            </Link>
            <Link className="feature-tile" href="/app/participant/dashboard">
              <div className="feature-kicker">Participant</div>
              <strong>Project workspace</strong>
              <span className="muted" style={{ fontSize: 'var(--text-sm)' }}>Move from analysis to evaluation with AI and mentor checkpoints.</span>
            </Link>
            <Link className="feature-tile" href="/app/mentor/dashboard">
              <div className="feature-kicker">Mentor</div>
              <strong>Review flow</strong>
              <span className="muted" style={{ fontSize: 'var(--text-sm)' }}>Monitor queue, validate submissions, and guide project quality.</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
