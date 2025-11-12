import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "text-foreground border-2",
        fire: "border-transparent bg-primary text-white shadow-glow animate-glow-pulse",
        flare: "border-transparent bg-gradient-warm text-white shadow-glow font-bold",
        "outline-fire": "border-2 border-primary text-primary bg-transparent",
        "outline-flare": "border-2 border-primary text-primary bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
