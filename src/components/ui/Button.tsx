import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "energy" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#1E50FF] text-white hover:bg-[#4E75FF] shadow-lg shadow-[#1E50FF]/25",
  gold:
    "bg-[#FFC700] text-[#0F172A] hover:bg-[#E5B200] shadow-lg shadow-[#FFC700]/30 font-bold",
  energy:
    "bg-[#C00000] text-white hover:bg-[#A00000] shadow-lg shadow-[#C00000]/25 font-bold",
  outline:
    "border-2 border-[#0F172A]/15 text-[#0F172A] hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A]",
  ghost: "text-[#0F172A] hover:bg-[#0F172A]/5",
  dark: "bg-[#0F172A] text-white hover:bg-[#1a2740]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E50FF] focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";