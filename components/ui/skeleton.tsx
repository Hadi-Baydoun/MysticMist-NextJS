import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-[#E5C6ED]/55 via-[#a156b4]/18 to-[#E5C6ED]/55",
        className
      )}
      {...props}
    />
  );
}
