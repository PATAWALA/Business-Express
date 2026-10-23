// src/components/admin/ui/Skeleton.tsx
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "circle";
}) {
  return (
    <div
      className={cn(
        "skeleton-shimmer",
        variant === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
    />
  );
}