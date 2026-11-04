"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { sanitizeCallbackUrl } from "@/lib/utils";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiBookOpen,
  FiInfo,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = sanitizeCallbackUrl(rawCallbackUrl);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      const msg = "Please enter both your library email and password.";
      setErrorMessage(msg);
      toast.error("Missing credentials", { description: msg });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        const errorMsg =
          res.error.message ||
          "Invalid email or password. Please verify your credentials.";
        setErrorMessage(errorMsg);
        toast.error("Sign in failed", {
          description: errorMsg,
        });
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!", {
        description: "You have signed into your BookNook reading sanctuary.",
      });

      router.push(callbackUrl);
      router.refresh();
    } catch {
      const fallbackMsg = "Unable to connect to the authentication server. Please try again.";
      setErrorMessage(fallbackMsg);
      toast.error("Authentication Error", {
        description: fallbackMsg,
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      const msg = "Could not initialize Google authentication.";
      setErrorMessage(msg);
      toast.error("Google Sign-In Error", { description: msg });
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <div className="rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 shadow-lg backdrop-blur-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mb-4 shadow-xs">
            <FiBookOpen />
          </div>
          <Heading
            as="h1"
            size="section"
            align="center"
            eyebrow="Reader Sign In"
            subtitle="Access your personal book collection, active borrows, and reading history."
          >
            Welcome Back
          </Heading>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-start gap-3 text-sm font-sans"
          >
            <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Authentication issue:</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="reader@booknook.library"
                className="input input-bordered w-full pl-10 pr-4 bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-xs font-medium text-secondary hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-11 bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/50 hover:text-base-content cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center h-12 mt-2"
          >
            Sign In to Library
          </Button>
        </form>

        <div className="divider my-6 text-xs text-base-content/50 uppercase tracking-widest font-sans">
          or continue with
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="btn btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 hover:text-base-content text-base-content w-full h-12 rounded-xl flex items-center justify-center gap-3 font-sans text-sm font-semibold transition-all duration-150 cursor-pointer"
        >
          {isGoogleLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FcGoogle className="w-5 h-5" />
          )}
          <span>Sign In with Google</span>
        </button>

        <div className="text-center mt-8 pt-6 border-t border-base-300 text-sm text-base-content/75 font-sans">
          <span>New to the sanctuary? </span>
          <Link
            href={
              rawCallbackUrl
                ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/register"
            }
            className="font-semibold text-primary hover:underline ml-1"
          >
            Create an Account
          </Link>
        </div>
      </div>

      {forgotModalOpen && (
        <dialog className="modal modal-open">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="modal-box rounded-2xl border border-base-300 bg-base-100 p-6 max-w-md shadow-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl mb-4">
              <FiInfo />
            </div>
            <h3 className="font-serif font-bold text-xl text-base-content">
              Password Assistance
            </h3>
            <p className="py-4 text-sm text-base-content/80 font-sans leading-relaxed">
              BookNook protects member accounts with care. To reset your library password or recover your borrowing privileges, please reach out directly to the desk curator at{" "}
              <a
                href="mailto:curator@booknook.library"
                className="text-primary font-semibold underline"
              >
                curator@booknook.library
              </a>
              {" "}with your registered library card or email.
            </p>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="btn btn-primary btn-sm px-5"
              >
                Understood
              </button>
            </div>
          </motion.div>
          <div
            className="modal-backdrop bg-black/40"
            onClick={() => setForgotModalOpen(false)}
          />
        </dialog>
      )}
    </motion.div>
  );
}

export default LoginForm;

