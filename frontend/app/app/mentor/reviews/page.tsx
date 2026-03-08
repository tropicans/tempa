import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { ReviewCard } from '@/components/review-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

const reviewItems = [
  {
    title: 'Digital Service Improvement Pilot',
    phase: 'analysis',
    state: 'submitted',
    description: 'Participant submitted a problem diagnostic report and is waiting for mentor validation.',
    href: '/app/mentor/projects/project-1/analysis-review',
  },
  {
    title: 'Permit Workflow Acceleration',
    phase: 'design',
    state: 'under_review',
    description: 'Decision option selection needs confirmation before implementation planning.',
    href: '/app/mentor/projects/project-2/design-review',
  },
  {
    title: 'Citizen Response Dashboard',
    phase: 'evaluation',
    state: 'submitted',
    description: 'Reflection and assessment package is ready for final scoring review.',
    href: '/app/mentor/projects/project-3/evaluation-review',
  },
];

export default async function MentorReviewsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Review Queue" subtitle="Unified queue for analysis, design, planning, and evaluation reviews." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Mentor queue</div>
          <h2 className="hero-title">Lihat apa yang harus direview sekarang dan prioritaskan yang paling blocking.</h2>
          <p className="muted">Queue ini menampilkan submission yang membutuhkan keputusan mentor agar proyek peserta tetap bergerak.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Pending now" value={reviewItems.length} />
          <StatCard label="Submitted" value={2} />
          <StatCard label="Under review" value={1} />
        </div>
      </section>
      <PageCard eyebrow="Review flow" title="Pending reviews" description="Filter and process mentor checkpoints from one place.">
        <div className="project-list">
          {reviewItems.map((item) => (
            <ReviewCard key={item.href} {...item} />
          ))}
        </div>
      </PageCard>
    </AppShell>
  );
}
