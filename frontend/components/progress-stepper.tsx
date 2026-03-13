'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Lightbulb, Code2, Rocket, BarChart3, CheckCircle } from 'lucide-react';
import { ReactNode } from 'react';

type Phase = {
  key: string;
  label: string;
  icon: ReactNode;
};

const phases: Phase[] = [
  { key: 'analysis', label: 'Analysis', icon: <Search size={14} /> },
  { key: 'design', label: 'Design', icon: <Lightbulb size={14} /> },
  { key: 'development', label: 'Development', icon: <Code2 size={14} /> },
  { key: 'implementation', label: 'Implementation', icon: <Rocket size={14} /> },
  { key: 'evaluation', label: 'Evaluation', icon: <BarChart3 size={14} /> },
];

type ProgressStepperProps = {
  currentPhase: string;
  basePath: string;
  completedPhases?: string[];
};

export function ProgressStepper({ currentPhase, basePath, completedPhases = [] }: ProgressStepperProps) {
  const pathname = usePathname();

  return (
    <div className="progress-stepper">
      {phases.map((phase, i) => {
        const isCompleted = completedPhases.includes(phase.key);
        const isCurrent = currentPhase === phase.key;
        const href = `${basePath}/${phase.key}`;
        const isActivePath = pathname === href;

        let className = 'progress-step';
        if (isCompleted) className += ' completed';
        else if (isCurrent || isActivePath) className += ' current';

        return (
          <span key={phase.key} style={{ display: 'contents' }}>
            <Link className={className} href={href}>
              <span className="progress-step-circle">
                {isCompleted ? <CheckCircle size={16} /> : phase.icon}
              </span>
              <span className="progress-step-label">{phase.label}</span>
            </Link>
            {i < phases.length - 1 && (
              <span className={`progress-connector${isCompleted ? ' completed' : ''}`} />
            )}
          </span>
        );
      })}
    </div>
  );
}
