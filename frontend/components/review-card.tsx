import Link from 'next/link';

type ReviewCardProps = {
  title: string;
  phase: string;
  state: string;
  description: string;
  href?: string;
};

export function ReviewCard({ title, phase, state, description, href }: ReviewCardProps) {
  const content = (
    <div className="review-card">
      <div className="project-meta">
        <span className="meta-chip">phase: {phase}</span>
        <span className="meta-chip">state: {state}</span>
      </div>
      <strong>{title}</strong>
      <p className="muted">{description}</p>
    </div>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
