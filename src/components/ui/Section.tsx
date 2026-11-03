import React from "react";
import { STYLES } from "@/lib/styles";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "main" | "article";
  spacing?: "container" | "compact" | "padded";
  children: React.ReactNode;
}

export function Section({
  as: Component = "section",
  spacing = "container",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn("booknook-section", STYLES.section[spacing], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Section;

