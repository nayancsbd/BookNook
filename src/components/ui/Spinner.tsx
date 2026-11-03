import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
  color?: "primary" | "secondary" | "accent" | "neutral";
  inline?: boolean;
}

export function Spinner({
  size = "md",
  label,
  color = "primary",
  inline = false,
  className,
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
    xl: "w-12 h-12",
  }[size];

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    neutral: "text-neutral",
  }[color];

  const spinnerElement = (
    <span
      className={cn("loading loading-spinner", sizeClasses, colorClasses)}
      aria-hidden="true"
    />
  );

  if (inline) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        {spinnerElement}
        {label && <span className="text-sm font-sans">{label}</span>}
      </span>
    );
  }

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4",
        className
      )}
      {...props}
    >
      {spinnerElement}
      {label && (
        <p className="font-serif italic text-sm sm:text-base text-base-content/80 animate-pulse">
          {label}
        </p>
      )}
      <span className="sr-only">{label || "Loading content..."}</span>
    </div>
  );
}

export default Spinner;

