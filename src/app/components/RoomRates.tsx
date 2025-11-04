'use client';
import { Skeleton } from '@/components/ui/skeleton';

interface RoomRatesProps {
  loading?: boolean;
  error?: Error | null;
  children?: React.ReactNode;
}

export default function RoomRates({ loading = false, error = null, children }: RoomRatesProps) {
  if (loading) return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  );

  if (error) return <div className="text-red-500 text-sm">Error loading room rates. Using default rates.</div>;

  return <>{children}</>;
}
