"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import {
  FiMail,
  FiBookOpen,
  FiClock,
  FiBookmark,
  FiShield,
  FiPlusCircle,
  FiLogOut,
} from "react-icons/fi";

export function ProfileView() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "R";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6"
    >
      <div className="rounded-3xl border border-base-300 bg-base-100 shadow-xl overflow-hidden backdrop-blur-sm">
        <div className="h-36 sm:h-44 bg-gradient-to-r from-primary via-primary/90 to-secondary/80 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-14 left-6 sm:left-10">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-base-100 shadow-xl overflow-hidden bg-base-200 flex items-center justify-center relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-4xl">
                  {initial}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 sm:pt-18 pb-8 px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-primary badge-sm font-sans font-medium">
                  Verified Reader
                </span>
                <span className="badge badge-outline badge-sm font-sans text-xs text-base-content/70">
                  Card #{user.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <Heading as="h1" size="section" className="text-2xl sm:text-3xl">
                {user.name}
              </Heading>
              <div className="flex items-center gap-2 text-base-content/75 text-sm mt-1 font-sans">
                <FiMail className="w-4 h-4 text-primary shrink-0" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-error hover:bg-error/10 hover:border-error"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-lg">
                <FiBookmark />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold block">
                  Status
                </span>
                <span className="font-semibold text-sm text-base-content">
                  Active Member
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-lg">
                <FiBookOpen />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold block">
                  Library Role
                </span>
                <span className="font-semibold text-sm text-base-content">
                  Sanctuary Reader
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center text-lg">
                <FiShield />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-base-content/60 font-semibold block">
                  Security
                </span>
                <span className="font-semibold text-sm text-base-content">
                  Protected Session
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-base-content mb-4">
              Reader Shortcuts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/my-books"
                className="flex items-center gap-3 p-3.5 rounded-xl border border-base-300 hover:border-primary hover:bg-base-200/50 transition-all font-sans text-sm font-semibold text-base-content"
              >
                <FiBookOpen className="text-primary w-5 h-5 shrink-0" />
                <span>My Contributed Books</span>
              </Link>

              <Link
                href="/my-borrows"
                className="flex items-center gap-3 p-3.5 rounded-xl border border-base-300 hover:border-secondary hover:bg-base-200/50 transition-all font-sans text-sm font-semibold text-base-content"
              >
                <FiClock className="text-secondary w-5 h-5 shrink-0" />
                <span>My Borrow Records</span>
              </Link>

              <Link
                href="/add-book"
                className="flex items-center gap-3 p-3.5 rounded-xl border border-base-300 hover:border-accent hover:bg-base-200/50 transition-all font-sans text-sm font-semibold text-base-content"
              >
                <FiPlusCircle className="text-accent w-5 h-5 shrink-0" />
                <span>Add New Book</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileView;

