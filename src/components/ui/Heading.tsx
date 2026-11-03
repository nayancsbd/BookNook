import React from "react";
import { STYLES } from "@/lib/styles";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "hero" | "main" | "section" | "sub";
  eyebrow?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

export function Heading({
  as: Component = "h1",
  size = "main",
  eyebrow,
  subtitle,
  align = "left",
  className,
  children,
  ...props
}: HeadingProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  return (
    <div className={cn("flex flex-col gap-2", alignClass)}>
      {eyebrow && (
        <span className={cn(STYLES.heading.eyebrow, "tracking-widest")}>
          {eyebrow}
        </span>
      )}
      <Component
        className={cn(
          "booknook-heading",
          STYLES.heading[size],
          className
        )}
        {...props}
      >
        {children}
      </Component>
      {subtitle && (
        <p className="max-w-2xl text-base sm:text-lg text-base-content/75 font-sans mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default Heading;

