import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import clientPromise from "./mongodb";

export async function getAuth() {
  const client = await clientPromise;
  const db = client.db("booknook");

  return betterAuth({
    database: mongodbAdapter(db, {
      client,
      transaction: false,
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        enabled: Boolean(process.env.GOOGLE_CLIENT_ID),
      },
    },
    plugins: [
      jwt({
        jwks: {
          keyPairConfig: {
            alg: "EdDSA",
            crv: "Ed25519",
          },
        },
      }),
    ],
    secret:
      process.env.BETTER_AUTH_SECRET ||
      "development-secret-key-booknook-at-least-32-chars",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  });
}
