import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-[#E5C6ED]/65 bg-white/95 py-6 text-[#2d1b33] shadow-[0_14px_44px_-18px_rgba(161,86,180,0.35)] ring-1 ring-[#a156b4]/[0.06] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 px-6", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6", className)} {...props} />;
}
