import { cn } from "@/lib/utils";

type BadgeColor = "express" | "gold" | "energy" | "neutral" | "white";

const colors: Record<BadgeColor, string> = {
  express: "bg-[#1E50FF]/10 text-[#1E50FF] border-[#1E50FF]/20",
  gold: "bg-[#FFC700]/20 text-[#8a6d00] border-[#FFC700]/50",
  energy: "bg-[#C00000]/10 text-[#C00000] border-[#C00000]/25",
  neutral: "bg-[#0F172A]/5 text-[#0F172A]/70 border-[#0F172A]/10",
  white: "bg-white/10 text-white border-white/20",
};

export function Badge({
  children,
  color = "neutral",
  className,
}: {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}