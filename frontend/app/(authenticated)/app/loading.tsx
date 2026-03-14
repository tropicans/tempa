import { DashboardSkeleton } from '@/components/loading-skeleton';

export default function Loading() {
  return (
    <div className="app-content">
      <DashboardSkeleton />
    </div>
  );
}
