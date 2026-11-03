import React from "react";
import Link from "next/link";
import { STYLES } from "@/lib/styles";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  iconPosition = "left",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "text-xs px-3.5 py-1.5",
    md: "text-sm sm:text-base px-6 py-2.5",
    lg: "text-base sm:text-lg px-8 py-3.5",
  }[size];

  const content = (
    <>
      {isLoading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        icon && iconPosition === "left" && <span className="text-lg">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === "right" && (
        <span className="text-lg">{icon}</span>
      )}
    </>
  );

  const combinedClassName = cn(
    "booknook-btn",
    variant === "primary" && "booknook-btn-primary",
    STYLES.button[variant],
    sizeClasses,
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;

