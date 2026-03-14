import Link from 'next/link';
import {
  FolderKanban,
  ClipboardCheck,
  Briefcase,
  BarChart3,
  Shield,
  ArrowRight,
  KeyRound,
} from 'lucide-react';

const roles = [
  {
    key: 'participant',
    label: 'Participant',
    href: '/login/as/participant',
    icon: <FolderKanban size={20} />,
    title: 'Drive project progress',
    desc: 'Move from analysis to evaluation with a focused phase workspace and clear next actions.',
    color: '#6C5CE7',
  },
  {
    key: 'mentor',
    label: 'Mentor',
    href: '/login/as/mentor',
    icon: <ClipboardCheck size={20} />,
    title: 'Review with confidence',
    desc: 'See review queues, pending checkpoints, and project context in one cleaner flow.',
    color: '#00B894',
  },
  {
    key: 'program_admin',
    label: 'Program Admin',
    href: '/login/as/program_admin',
    icon: <Briefcase size={20} />,
    title: 'Run program operations',
    desc: 'Manage programs, cohorts, and setup tasks without losing governance visibility.',
    color: '#0984E3',
  },
  {
    key: 'executive',
    label: 'Executive',
    href: '/login/as/executive_viewer',
    icon: <BarChart3 size={20} />,
    title: 'Read portfolio health fast',
    desc: 'Focus on strategic outcomes, implementation momentum, and talent indicators.',
    color: '#E17055',
  },
  {
    key: 'operator',
    label: 'Operator',
    href: '/login/as/platform_operator',
    icon: <Shield size={20} />,
    title: 'Keep the platform reliable',
    desc: 'Monitor health, audit changes, and maintain support workflows from one place.',
    color: '#636E72',
  },
];

export default function LoginPage() {
  return (
    <div className="shell subtle-grid" style={{ paddingTop: '60px' }}>
      <section style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div className="stack" style={{ gap: '16px', animation: 'fadeUp 0.5s ease both', marginBottom: '32px' }}>
          <div className="pill" style={{ margin: '0 auto' }}>
            <KeyRound size={12} /> Single sign-on
          </div>
          <h1 className="hero-title">
            Masuk ke workspace Anda
          </h1>
          <p className="muted" style={{ maxWidth: '480px', margin: '0 auto' }}>
            Pilih role untuk masuk. Nantinya area ini akan menjadi SSO institusi tanpa mengubah experience utama.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Link className="button" href="/login/as/participant">
              Masuk sebagai participant <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="stack" style={{ gap: '12px', animation: 'fadeUp 0.5s ease 0.2s both', textAlign: 'left' }}>
          <div className="section-eyebrow">Demo roles</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {roles.map((role) => (
              <Link
                key={role.key}
                className="feature-tile"
                href={role.href}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: role.color,
                  }}
                />
                <div
                  className="feature-kicker"
                  style={{
                    background: `${role.color}15`,
                    color: role.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {role.icon} {role.label}
                </div>
                <strong>{role.title}</strong>
                <span className="muted" style={{ fontSize: 'var(--text-sm)' }}>{role.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
