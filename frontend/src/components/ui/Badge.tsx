import * as React from "react"
import { cn } from "../../utils/classnames"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'outline';
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/20 text-primary border-transparent",
    danger: "bg-danger/20 text-danger border-transparent",
    warning: "bg-warning/20 text-warning border-transparent",
    success: "bg-success/20 text-success border-transparent",
    outline: "text-text-muted border-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
