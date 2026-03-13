type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={`skeleton ${className ?? ''}`} style={style} />;
}

export function SkeletonText({ lines = 3, width }: { lines?: number; width?: string }) {
  return (
    <div className="stack" style={{ gap: '8px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="skeleton-text"
          style={{ width: width ?? (i === lines - 1 ? '60%' : '100%') }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return <Skeleton className="skeleton-card" />;
}

export function DashboardSkeleton() {
  return (
    <div className="page-shell stack" style={{ gap: '16px' }}>
      <Skeleton style={{ height: '44px', width: '100%', borderRadius: '16px' }} />
      <div className="grid grid-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid grid-2">
        <Skeleton style={{ height: '200px', width: '100%', borderRadius: '12px' }} />
        <Skeleton style={{ height: '200px', width: '100%', borderRadius: '12px' }} />
      </div>
    </div>
  );
}
