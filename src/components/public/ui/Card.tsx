import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[#0F172A]/8 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}