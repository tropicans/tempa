import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function EvaluationReviewPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Evaluation Review" subtitle="Complete assessment and confirm TAI publication readiness." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Final review</div>
          <h2 className="hero-title">Gabungkan reflection, evidence, dan judgment mentor ke hasil akhir yang kredibel.</h2>
          <p className="muted">Di tahap ini mentor menilai kedewasaan refleksi dan kesiapan publikasi skor TAI.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Reflection" value="submitted" />
          <StatCard label="TAI readiness" value="ready" />
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Assessment" title="Scoring review" description="Show reflection summary, scoring rubric, and publication controls.">
          <div className="decision-grid">
            <div className="decision-box"><strong>Reflection summary</strong><p className="muted">Participant demonstrates stronger diagnosis discipline and implementation awareness.</p></div>
            <div className="decision-box"><strong>Evidence health</strong><p className="muted">Impact metrics are present, but one KPI still needs stronger evidence linkage.</p></div>
            <div className="decision-box"><strong>Publication advice</strong><p className="muted">Publish once mentor comments are finalized and rubric scores are locked.</p></div>
          </div>
        </PageCard>
        <PageCard eyebrow="Control" title="Publication prompts" description="Use these checks before confirming the final score.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><b>Reflection is specific and honest</b></div></div>
            <div className="journey-step"><strong>2</strong><div><b>Evidence supports the impact claim</b></div></div>
            <div className="journey-step"><strong>3</strong><div><b>Score can be defended in audit</b></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
