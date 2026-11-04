"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import {
  FiPlusCircle,
  FiBookOpen,
  FiRotateCcw,
  FiBookmark,
} from "react-icons/fi";

interface StepItem {
  number: string;
  action: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    action: "Add",
    title: "Add a Cherished Book",
    description:
      "Share books from your personal reading nook with fellow book lovers. Enter the book title, author, category, and cover image to add it directly to our catalog.",
    icon: <FiPlusCircle className="w-6 h-6" />,
    accentColor: "text-primary bg-primary/10 border-primary/20",
  },
  {
    number: "02",
    action: "Borrow",
    title: "Borrow with Ease",
    description:
      "Explore curated shelves across multiple genres. Select any available volume to borrow and set a comfortable return date for your reading sessions.",
    icon: <FiBookOpen className="w-6 h-6" />,
    accentColor: "text-secondary bg-secondary/15 border-secondary/25",
  },
  {
    number: "03",
    action: "Return",
    title: "Return for Others",
    description:
      "Once you turn the final page, return the volume back to the sanctuary with a single click so other passionate readers can enjoy the journey.",
    icon: <FiRotateCcw className="w-6 h-6" />,
    accentColor: "text-accent bg-accent/15 border-accent/25",
  },
];

export function HowItWorks() {
  return (
    <section className="booknook-section bg-base-200/40 border-y border-base-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase font-sans mb-3">
            <FiBookmark className="w-3.5 h-3.5" />
            <span>Simple 3-Step Process</span>
          </div>
          <Heading
            as="h2"
            size="hero"
            align="center"
            subtitle="BookNook is built on trust and shared reading passions. Here is how our library shelf cycle works."
          >
            How Borrowing Works
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
              className="relative flex flex-col rounded-3xl border border-base-300 bg-base-100 p-8 shadow-xs hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform duration-300 ${step.accentColor}`}
                >
                  {step.icon}
                </div>
                <span className="font-serif font-bold text-3xl sm:text-4xl text-base-content/20 select-none">
                  {step.number}
                </span>
              </div>

              <div className="mb-2">
                <span className="badge badge-sm font-sans font-semibold uppercase tracking-wider text-[11px] mb-2 bg-base-200 text-base-content/70 border-base-300">
                  {step.action}
                </span>
                <h3 className="font-serif font-bold text-xl text-base-content leading-snug">
                  {step.title}
                </h3>
              </div>

              <p className="text-sm text-base-content/75 font-sans leading-relaxed mt-2 flex-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
