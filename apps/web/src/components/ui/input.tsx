import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "focus-ring flex h-11 w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
