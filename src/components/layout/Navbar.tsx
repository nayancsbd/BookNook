"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import {
  FiBookOpen,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiPlusCircle,
  FiBook,
  FiClock,
  FiHome,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  authRequired?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: "Home", href: "/", icon: <FiHome /> },
  { name: "All Books", href: "/books", icon: <FiBook /> },
  { name: "Add Book", href: "/books/add", icon: <FiPlusCircle />, authRequired: true },
  { name: "My Books", href: "/my-books", icon: <FiBookOpen />, authRequired: true },
  { name: "My Borrows", href: "/my-borrows", icon: <FiClock />, authRequired: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, toggleAuth } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.authRequired || (link.authRequired && user)
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-base-300 bg-base-100/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-sm group-hover:scale-105 transition-transform">
            <FiBookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-base-content leading-none">
              BookNook
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-secondary mt-0.5">
              Reading Sanctuary
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {visibleLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2",
                  active
                    ? "bg-primary text-primary-content font-semibold shadow-xs"
                    : "text-base-content/80 hover:text-base-content hover:bg-base-200"
                )}
              >
                {link.icon && <span className="text-base">{link.icon}</span>}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {user ? (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar border border-base-300 hover:border-primary focus:ring-2 focus:ring-primary transition-all p-0.5"
                aria-label="User account menu"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-serif font-bold">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm z-50 mt-3 p-3 shadow-xl bg-base-100 rounded-2xl w-60 border border-base-300 gap-1 text-base-content"
              >
                <li className="menu-title px-2 py-1.5 border-b border-base-300 mb-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-serif font-bold text-sm text-base-content">
                      {user.name}
                    </span>
                    <span className="text-xs text-base-content/60 font-sans truncate">
                      {user.email}
                    </span>
                  </div>
                </li>

                <li>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 py-2 hover:bg-base-200 rounded-lg"
                  >
                    <FiUser className="w-4 h-4 text-primary" />
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-books"
                    className="flex items-center gap-2.5 py-2 hover:bg-base-200 rounded-lg"
                  >
                    <FiBookOpen className="w-4 h-4 text-secondary" />
                    <span>My Books</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-borrows"
                    className="flex items-center gap-2.5 py-2 hover:bg-base-200 rounded-lg"
                  >
                    <FiClock className="w-4 h-4 text-accent" />
                    <span>My Borrows</span>
                  </Link>
                </li>

                <div className="divider my-1" />

                <li>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2.5 py-2 text-error hover:bg-error/10 rounded-lg font-medium"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button href="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button href="/register" variant="primary" size="sm">
                Register
              </Button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-square btn-sm sm:btn-md lg:hidden border border-base-300 text-base-content hover:bg-base-200"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-base-300 bg-base-100 px-4 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col gap-1">
            {visibleLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors",
                    active
                      ? "bg-primary text-primary-content font-semibold"
                      : "text-base-content/85 hover:bg-base-200"
                  )}
                >
                  {link.icon && <span className="text-lg">{link.icon}</span>}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {!user && (
            <div className="pt-3 border-t border-base-300 flex flex-col gap-2">
              <Button
                href="/login"
                variant="outline"
                size="md"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Button>
              <Button
                href="/register"
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;

