import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-primary/12 text-primary ring-1 ring-primary/24",
      mint: "bg-mint-300/18 text-emerald-600 ring-1 ring-emerald-400/25 dark:text-mint-300",
      peach: "bg-peach-300/20 text-orange-600 ring-1 ring-orange-400/25 dark:text-peach-200",
      violet: "bg-lavender-300/20 text-lavender-500 ring-1 ring-lavender-300/30 dark:text-lavender-200",
      slate: "bg-muted text-muted-foreground ring-1 ring-border"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
