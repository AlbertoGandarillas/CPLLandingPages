import { Skeleton } from '@/components/ui/skeleton';
export default function SkeletonTable() {
  return (
    <div className="flex flex-col space-y-3 p-2">
      <Skeleton className="h-[60px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
