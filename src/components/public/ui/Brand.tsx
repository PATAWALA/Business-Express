import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

const sizes = {
  sm: { icon: 36, text: "text-xs" },
  md: { icon: 48, text: "text-sm" },
  lg: { icon: 64, text: "text-lg" },
};

export function Brand({ size = "md", variant = "full", className }: BrandProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/logo.png"
        alt="Business Express"
        width={s.icon}
        height={s.icon}
        className="object-contain"
        priority
      />
      {variant === "full" && (
        <span className={cn("font-black tracking-tight text-[#0F172A]", s.text)}>
          BUSINESS <span className="text-[#1E50FF]">EXPRESS</span>
        </span>
      )}
    </div>
  );
}