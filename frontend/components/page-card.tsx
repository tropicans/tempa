import { ReactNode } from 'react';

type PageCardProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function PageCard({ title, description, eyebrow, children }: PageCardProps) {
  return (
    <section className="card stack">
      <div>
        {eyebrow ? <div className="section-eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
        <p className="muted">{description}</p>
      </div>
      {children}
    </section>
  );
}
