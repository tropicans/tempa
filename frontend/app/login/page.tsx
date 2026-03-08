import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function LoginPage() {
  return (
    <AppShell title="Login" subtitle="Placeholder SSO entry point for the TEMPA MVP.">
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Single sign-on</div>
          <h2 className="hero-title">Masuk dan pilih mode kerja kamu hari ini.</h2>
          <p className="muted">
            Untuk skeleton ini, role dipilih lewat cookie demo. Nanti bagian ini bisa langsung diganti ke SSO instansi.
          </p>
          <div className="signal-box">
            <strong>Current approach</strong>
            <p className="muted">Mock login ini sengaja dibuat cepat supaya tim bisa menguji flow participant, mentor, admin, dan executive tanpa setup IAM penuh.</p>
          </div>
        </div>
        <div className="metric-strip">
          <div className="metric-card">
            <div className="metric-label">Entry model</div>
            <div className="metric-value">Role switch</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Future auth</div>
            <div className="metric-value">SSO</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Access control</div>
            <div className="metric-value">RBAC</div>
          </div>
        </div>
      </section>
      <PageCard eyebrow="Demo roles" title="Continue as" description="Use one of the role presets below to explore the application.">
        <div className="grid grid-3">
          <Link className="feature-tile" href="/login/as/participant">
            <div className="feature-kicker">Participant</div>
            <strong>Build and submit project work</strong>
            <span className="muted">Analysis, design, implementation evidence, reflection, and TAI.</span>
          </Link>
          <Link className="feature-tile" href="/login/as/mentor">
            <div className="feature-kicker">Mentor</div>
            <strong>Review and approve</strong>
            <span className="muted">Validate problem framing, decision design, and final evaluation.</span>
          </Link>
          <Link className="feature-tile" href="/login/as/program_admin">
            <div className="feature-kicker">Program admin</div>
            <strong>Manage program setup</strong>
            <span className="muted">Programs, cohorts, participant enrollment, and mentor assignment.</span>
          </Link>
          <Link className="feature-tile" href="/login/as/executive_viewer">
            <div className="feature-kicker">Executive</div>
            <strong>See portfolio-level outcomes</strong>
            <span className="muted">Follow implementation rates and talent evidence at a glance.</span>
          </Link>
          <Link className="feature-tile" href="/login/as/platform_operator">
            <div className="feature-kicker">Operator</div>
            <strong>Operate the platform</strong>
            <span className="muted">Audit, monitoring, and configuration views for support and governance.</span>
          </Link>
        </div>
      </PageCard>
    </AppShell>
  );
}
