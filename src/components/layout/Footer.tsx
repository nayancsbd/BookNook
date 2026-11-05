import React from "react";
import Link from "next/link";
import { FiBookOpen, FiMapPin } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200/50 text-base-content transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-sm">
                <FiBookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl tracking-tight text-base-content leading-none">
                  BookNook
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-secondary mt-0.5">
                  Reading Sanctuary
                </span>
              </div>
            </Link>

            <p className="max-w-md text-sm sm:text-base text-base-content/80 leading-relaxed font-sans">
              BookNook is a warm community library sanctuary dedicated to sharing cherished stories, lending forgotten classics, and nurturing lifelong reading habits.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BookNook on Facebook"
                className="w-10 h-10 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center text-base-content/80 hover:text-primary hover:border-primary transition-all duration-150"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BookNook on Instagram"
                className="w-10 h-10 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center text-base-content/80 hover:text-secondary hover:border-secondary transition-all duration-150"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BookNook on LinkedIn"
                className="w-10 h-10 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center text-base-content/80 hover:text-primary hover:border-primary transition-all duration-150"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BookNook on X"
                className="w-10 h-10 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center text-base-content/80 hover:text-base-content hover:border-base-content transition-all duration-150"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-serif font-bold text-lg text-base-content tracking-tight">
              Library Navigation
            </h4>
            <ul className="space-y-2 text-sm text-base-content/75 font-sans">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-primary transition-colors">
                  All Borrowable Books
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="hover:text-primary transition-colors">
                  Contribute a Book
                </Link>
              </li>
              <li>
                <Link href="/my-books" className="hover:text-primary transition-colors">
                  My Book Contributions
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="hover:text-primary transition-colors">
                  My Borrowed Books
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <h4 className="font-serif font-bold text-lg text-base-content tracking-tight">
              Contact & Hours
            </h4>
            <ul className="space-y-2.5 text-sm text-base-content/80 font-sans">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Savar, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-base-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/70 font-sans">
          <p>© 2026 BookNook Library Sanctuary. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/guidelines" className="hover:text-primary transition-colors">
              Borrowing Code of Honor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

