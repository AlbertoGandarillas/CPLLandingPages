import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
interface SkeletonWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
  variant?: "default" | "table" | "card";
  count?: number;
}
export default function SkeletonWrapper({
  children,
  isLoading,
  fullWidth = false,
  variant = "default",
  count = 1,
}: SkeletonWrapperProps) {
  if (!isLoading) {
    return <>{children}</>;
  }
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={cn(fullWidth && "w-full")}>
          {variant === "table" && <SkeletonTable />}
          {variant === "card" && <SkeletonCard />}
          {variant === "default" && <Skeleton className="h-4 w-full mb-2" />}
        </div>
      ))}
    </>
  );
}
function SkeletonTable() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
function SkeletonCard() {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}