"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import {
  FiBookOpen,
  FiCompass,
  FiClock,
  FiSmile,
  FiGrid,
  FiArrowUpRight,
  FiLayers,
} from "react-icons/fi";

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  accentClass: string;
  badgeCount: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "Fiction",
    name: "Fiction",
    description: "Classic literature, magical realism, gripping mysteries, and lyrical prose.",
    icon: <FiBookOpen className="w-6 h-6" />,
    accentClass: "text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-content",
    badgeCount: "4,200+ Books",
  },
  {
    id: "Science",
    name: "Science",
    description: "Cosmic exploration, natural history, physics, and ecology discoveries.",
    icon: <FiCompass className="w-6 h-6" />,
    accentClass: "text-secondary bg-secondary/15 group-hover:bg-secondary group-hover:text-secondary-content",
    badgeCount: "1,850+ Books",
  },
  {
    id: "History",
    name: "History",
    description: "Ancient civilizations, global memoirs, pivotal eras, and chronicles.",
    icon: <FiClock className="w-6 h-6" />,
    accentClass: "text-accent bg-accent/15 group-hover:bg-accent group-hover:text-accent-content",
    badgeCount: "2,400+ Books",
  },
  {
    id: "Kids",
    name: "Kids",
    description: "Bedtime fairy tales, vibrant picture books, and young reader adventures.",
    icon: <FiSmile className="w-6 h-6" />,
    accentClass: "text-primary bg-primary/10 group-hover:bg-primary group-hover:text-primary-content",
    badgeCount: "950+ Books",
  },
  {
    id: "Others",
    name: "Others",
    description: "Philosophy essays, graphic novels, culinary journals, and artisan zines.",
    icon: <FiGrid className="w-6 h-6" />,
    accentClass: "text-secondary bg-secondary/15 group-hover:bg-secondary group-hover:text-secondary-content",
    badgeCount: "1,120+ Books",
  },
];

export function TopCategories() {
  return (
    <section className="booknook-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold tracking-wider uppercase font-sans mb-3">
            <FiLayers className="w-3.5 h-3.5" />
            <span>Curated Genres</span>
          </div>
          <Heading
            as="h2"
            size="hero"
            align="center"
            subtitle="Find the exact atmosphere for your next reading evening across our five core library genres."
          >
            Top Categories
          </Heading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {CATEGORIES.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
              className="h-full"
            >
              <Link
                href={`/books?category=${category.name}`}
                className="group flex flex-col justify-between h-full rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs hover:shadow-lg hover:border-primary/40 transition-shadow duration-300 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${category.accentClass}`}
                    >
                      {category.icon}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-base-content/50 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      <FiArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-base-content mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-xs text-base-content/70 font-sans leading-relaxed line-clamp-3">
                    {category.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-base-300/60">
                  <span className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-wider">
                    {category.badgeCount}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopCategories;
