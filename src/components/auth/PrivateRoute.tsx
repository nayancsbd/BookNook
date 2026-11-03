"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Spinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRouteContent({ children }: PrivateRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { user, isLoading: authLoading } = useAuth();

  const isPending = sessionPending || authLoading;
  const isAuthenticated = Boolean(session || user);

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      const queryString = searchParams?.toString();
      const returnUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(`/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isPending, isAuthenticated, pathname, searchParams, router]);

  if (isPending) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
        <Spinner size="lg" label="Verifying reader membership..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
        <Spinner size="lg" label="Redirecting to sanctuary login..." />
      </div>
    );
  }

  return <>{children}</>;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
          <Spinner size="lg" label="Checking library access..." />
        </div>
      }
    >
      <PrivateRouteContent>{children}</PrivateRouteContent>
    </React.Suspense>
  );
}

export default PrivateRoute;

