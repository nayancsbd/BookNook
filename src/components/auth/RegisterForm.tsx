"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { sanitizeCallbackUrl } from "@/lib/utils";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import {
  FiUser,
  FiMail,
  FiImage,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheck,
  FiBookOpen,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = sanitizeCallbackUrl(rawCallbackUrl);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setErrorMessage(null);

    if (!name.trim()) {
      const msg = "Please enter your full reader name.";
      setErrorMessage(msg);
      toast.error("Missing Information", { description: msg });
      return;
    }

    if (!email.trim()) {
      const msg = "Please provide your email address.";
      setErrorMessage(msg);
      toast.error("Missing Information", { description: msg });
      return;
    }

    if (!isPasswordValid) {
      const msg = "Password does not meet the library security requirements.";
      setErrorMessage(msg);
      toast.error("Invalid Password", {
        description: "Password must have at least 6 characters, one uppercase letter, and one lowercase letter.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
      });

      if (res.error) {
        const errorMsg =
          res.error.message ||
          "Could not create account with this email address. Please check your details.";
        setErrorMessage(errorMsg);
        toast.error("Registration Failed", {
          description: errorMsg,
        });
        setIsLoading(false);
        return;
      }

      toast.success("Membership Created!", {
        description: "Your library account is registered. Please sign in to enter the sanctuary.",
      });

      const redirectPath = rawCallbackUrl
        ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/login";

      router.push(redirectPath);
    } catch {
      const fallbackMsg = "Could not connect to the registration service. Please try again.";
      setErrorMessage(fallbackMsg);
      toast.error("Registration Error", {
        description: fallbackMsg,
      });
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      const msg = "Could not initialize Google registration.";
      setErrorMessage(msg);
      toast.error("Google Registration Error", { description: msg });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-8 sm:p-10 shadow-lg backdrop-blur-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center text-2xl mb-4 shadow-xs">
            <FiBookOpen />
          </div>
          <Heading
            as="h1"
            size="section"
            align="center"
            eyebrow="Reader Registration"
            subtitle="Create your library membership to start borrowing, reviewing, and curating books."
          >
            Join BookNook
          </Heading>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-start gap-3 text-sm font-sans"
          >
            <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Registration issue:</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                <FiUser className="w-4 h-4" />
              </span>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Eleanor Vance"
                className="input input-bordered w-full pl-10 pr-4 bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              />
            </div>
          </div>

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
                placeholder="eleanor@booknook.library"
                className="input input-bordered w-full pl-10 pr-4 bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="photoUrl"
              className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans"
            >
              Photo URL <span className="normal-case text-base-content/50 text-xs font-normal">(Optional profile avatar)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                <FiImage className="w-4 h-4" />
              </span>
              <input
                id="photoUrl"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="input input-bordered w-full pl-10 pr-4 bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-base-content/80 font-sans"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Create a strong password"
                className={`input input-bordered w-full pl-10 pr-11 bg-base-100 border-base-300 focus:border-primary focus:ring-1 focus:ring-primary font-sans text-sm rounded-xl h-11 ${
                  hasSubmitted && !isPasswordValid ? "border-error focus:border-error focus:ring-error" : ""
                }`}
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

            <div className="mt-2 p-3 rounded-xl bg-base-200/60 border border-base-300/80 text-xs font-sans space-y-1.5">
              <span className="font-semibold block text-base-content/75 mb-1">
                Password Requirements:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    hasMinLength ? "text-success font-medium" : "text-base-content/60"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      hasMinLength ? "bg-success/20 text-success" : "bg-base-300 text-base-content/50"
                    }`}
                  >
                    {hasMinLength ? <FiCheck /> : "•"}
                  </span>
                  <span>Min 6 characters</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    hasUppercase ? "text-success font-medium" : "text-base-content/60"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      hasUppercase ? "bg-success/20 text-success" : "bg-base-300 text-base-content/50"
                    }`}
                  >
                    {hasUppercase ? <FiCheck /> : "•"}
                  </span>
                  <span>One uppercase (A-Z)</span>
                </div>

                <div
                  className={`flex items-center gap-1.5 transition-colors ${
                    hasLowercase ? "text-success font-medium" : "text-base-content/60"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      hasLowercase ? "bg-success/20 text-success" : "bg-base-300 text-base-content/50"
                    }`}
                  >
                    {hasLowercase ? <FiCheck /> : "•"}
                  </span>
                  <span>One lowercase (a-z)</span>
                </div>
              </div>

              {hasSubmitted && !isPasswordValid && (
                <p className="text-error font-medium text-xs pt-1 flex items-center gap-1">
                  <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {!hasMinLength
                      ? "Password must have at least 6 characters."
                      : !hasUppercase
                      ? "Password requires at least one uppercase letter."
                      : "Password requires at least one lowercase letter."}
                  </span>
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full justify-center h-12 mt-4"
          >
            Create Library Membership
          </Button>
        </form>

        <div className="divider my-6 text-xs text-base-content/50 uppercase tracking-widest font-sans">
          or register with
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isLoading}
          className="btn btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 hover:text-base-content text-base-content w-full h-12 rounded-xl flex items-center justify-center gap-3 font-sans text-sm font-semibold transition-all duration-150 cursor-pointer"
        >
          {isGoogleLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <FcGoogle className="w-5 h-5" />
          )}
          <span>Sign Up with Google</span>
        </button>

        <div className="text-center mt-8 pt-6 border-t border-base-300 text-sm text-base-content/75 font-sans">
          <span>Already registered with BookNook? </span>
          <Link
            href={
              rawCallbackUrl
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/login"
            }
            className="font-semibold text-primary hover:underline ml-1"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;

