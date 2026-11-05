export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function sanitizeCallbackUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") {
    return "/";
  }
  const trimmed = url.trim();
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.includes("\\") &&
    !trimmed.includes(":")
  ) {
    return trimmed;
  }
  return "/";
}

export function getApiUrl(path: string): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const baseUrl = envUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (baseUrl.endsWith("/api") && cleanPath.startsWith("/api/")) {
    return `${baseUrl}${cleanPath.substring(4)}`;
  }
  return `${baseUrl}${cleanPath}`;
}
