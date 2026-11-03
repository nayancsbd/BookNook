import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { MongoClient } from "mongodb";
import { url } from "inspector";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/booknook";

const client = new MongoClient(uri);
const db = client.db("book-nook");

const passwordRulePlugin = {
  id: "password-rule-validator",
  hooks: {
    before: [
      {
        matcher(ctx: { path?: string }) {
          return (
            ctx.path?.startsWith("/sign-up/email") ||
            ctx.path?.startsWith("/reset-password") ||
            ctx.path?.startsWith("/change-password") ||
            false
          );
        },
        handler: createAuthMiddleware(async (ctx) => {
          const body = ctx.body as Record<string, unknown> | undefined;
          const password = body?.password || body?.newPassword;
          if (typeof password === "string") {
            if (password.length < 6) {
              throw new APIError("BAD_REQUEST", {
                message: "Password must be at least 6 characters long.",
              });
            }
            if (!/[A-Z]/.test(password)) {
              throw new APIError("BAD_REQUEST", {
                message: "Password must contain at least one uppercase letter.",
              });
            }
            if (!/[a-z]/.test(password)) {
              throw new APIError("BAD_REQUEST", {
                message: "Password must contain at least one lowercase letter.",
              });
            }
          }
        }),
      },
    ],
  },
};

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
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
    passwordRulePlugin,
  ],
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "development-secret-key-booknook-at-least-32-chars",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
