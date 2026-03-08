import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function AnalysisReviewPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Analysis Review" subtitle="Approve or request revision for the problem diagnostic report." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Checkpoint review</div>
          <h2 className="hero-title">Pastikan framing masalah sudah cukup tajam untuk lanjut ke design.</h2>
          <p className="muted">Fokus pada kejelasan problem, kualitas root cause, dan kecukupan stakeholder mapping.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Phase" value="Analysis" />
          <StatCard label="State" value="submitted" />
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Submission" title="Diagnostic report" description="Review the participant narrative and AI-assisted framing.">
          <div className="decision-grid">
            <div className="decision-box"><strong>Problem statement</strong><p className="muted">Service request handling is slow, inconsistent, and hard to monitor across units.</p></div>
            <div className="decision-box"><strong>Root causes</strong><p className="muted">Manual routing, low visibility, and fragmented SOP adoption.</p></div>
            <div className="decision-box"><strong>Stakeholders</strong><p className="muted">Front office, service admin, supervisor, and citizens.</p></div>
          </div>
        </PageCard>
        <PageCard eyebrow="Decision" title="Review controls" description="Use these prompts before approving the phase gate.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><b>Approve</b><p className="muted">Use when the problem framing is precise and evidence-backed.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><b>Request revision</b><p className="muted">Use when the issue is still too broad, too vague, or unsupported.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><b>Leave comments</b><p className="muted">Point to the exact gap so the participant can revise quickly.</p></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
