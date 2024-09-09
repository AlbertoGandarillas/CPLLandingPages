import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import SkeletonTable from "./SkeletonTable";
interface SkeletonWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
  variant?: "default" | "table"; // Add variant prop
}
export default function SkeletonWrapper({
  children,
  isLoading,
  fullWidth,
  variant = "default",
}: SkeletonWrapperProps) {
  if (!isLoading) {
    return <>{children}</>;
  }
  return variant === "table" ? (
    <SkeletonTable />
  ) : (
    <Skeleton className={cn(fullWidth && "w-full")}>
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
