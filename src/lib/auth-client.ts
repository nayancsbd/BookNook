import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [jwtClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export async function getJwtToken(): Promise<string | null> {
  try {
    const res = await authClient.$fetch<{ token: string }>("/token", {
      method: "GET",
    });
    return res.data?.token ?? null;
  } catch {
    return null;
  }
}
