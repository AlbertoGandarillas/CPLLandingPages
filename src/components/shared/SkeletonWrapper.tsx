import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
interface SkeletonWrapperProps {
  children?: React.ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
  variant?: "default" | "table" | "card" | "loading";
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
          {variant === "loading" && <SkeletonLoading />}
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
function SkeletonLoading() {
  return (
    <div className="flex justify-center items-center">
      <svg
        className="animate-spin h-8 w-8 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
