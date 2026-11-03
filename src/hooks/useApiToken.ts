"use client";

import { useCallback } from "react";
import { getJwtToken } from "@/lib/auth-client";

export function useApiToken() {
  const fetchToken = useCallback(async (): Promise<string | null> => {
    return await getJwtToken();
  }, []);

  return fetchToken;
}

export default useApiToken;

