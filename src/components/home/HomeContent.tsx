"use client";

import React from "react";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import {
  FiCompass,
  FiHeart,
  FiArrowRight,
  FiBookmark,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "sonner";

export function HomeContent() {
  const showToast = () => {
    toast.success("Welcome to BookNook!", {
      description: "Your cozy reading sanctuary is ready to explore.",
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <Section spacing="padded" className="relative overflow-hidden">
        <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-12 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Heading
              as="h1"
              size="hero"
              eyebrow="A Warm Haven for Readers"
              subtitle="Curl up with timeless classics, contemporary stories, and a thoughtful community of passionate bibliophiles."
            >
              Where every story feels like coming home.
            </Heading>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                icon={<FiArrowRight />}
                iconPosition="right"
                onClick={showToast}
                href="/books"
              >
                Explore Collection
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<FiBookmark />}
                iconPosition="left"
                onClick={() => toast.info("Opening Reading Nook Club...")}
              >
                Join Book Club
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-base-300">
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl text-primary">
                  12,500+
                </span>
                <span className="text-xs text-base-content/70">
                  Handpicked Titles
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl text-secondary">
                  4.9 / 5
                </span>
                <span className="text-xs text-base-content/70">
                  Reader Rating
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl text-accent">
                  100% Cozy
                </span>
                <span className="text-xs text-base-content/70">
                  Warm Atmosphere
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-base-300 bg-base-200/70 p-6 sm:p-8 shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-base-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary/70" />
                  <span className="w-3 h-3 rounded-full bg-secondary/70" />
                  <span className="w-3 h-3 rounded-full bg-accent/70" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Curator’s Choice
                </span>
              </div>

              <div className="pt-6 space-y-4">
                <div className="p-4 rounded-xl bg-base-100 border border-base-300/60 shadow-xs flex gap-4 items-center">
                  <div className="w-14 h-20 rounded-md bg-primary text-primary-content flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                    ❦
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-base-content">
                      The Library of Lost & Found
                    </h4>
                    <p className="text-xs text-base-content/70">
                      Phaedra Patrick • Literary Fiction
                    </p>
                    <div className="flex items-center gap-1 text-secondary text-xs mt-1">
                      ★ ★ ★ ★ ★ <span className="text-base-content/60 ml-1">4.9</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-base-100 border border-base-300/60 shadow-xs flex gap-4 items-center">
                  <div className="w-14 h-20 rounded-md bg-secondary text-secondary-content flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                    ☕
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-base-content">
                      Before the Coffee Gets Cold
                    </h4>
                    <p className="text-xs text-base-content/70">
                      Toshikazu Kawaguchi • Magical Realism
                    </p>
                    <div className="flex items-center gap-1 text-secondary text-xs mt-1">
                      ★ ★ ★ ★ ★ <span className="text-base-content/60 ml-1">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-base-100 border border-base-300/60 shadow-xs flex gap-4 items-center">
                  <div className="w-14 h-20 rounded-md bg-neutral text-neutral-content flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                    🌲
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-base-content">
                      The Midnight Library
                    </h4>
                    <p className="text-xs text-base-content/70">
                      Matt Haig • Contemporary
                    </p>
                    <div className="flex items-center gap-1 text-secondary text-xs mt-1">
                      ★ ★ ★ ★ ★ <span className="text-base-content/60 ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-base-300 text-center">
                <p className="text-xs text-base-content/70 italic font-serif">
                  “A room without books is like a body without a soul.” — Cicero
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="container" id="catalog" className="bg-base-200/40 border-t border-base-300">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Heading
            as="h2"
            size="section"
            align="center"
            eyebrow="Crafted With Care"
            subtitle="Everything in BookNook is designed around calm reading moments and literary appreciation."
          >
            The Cozy Library Experience
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-base-100 border border-base-300 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl mb-4">
              <FiCompass />
            </div>
            <h3 className="font-serif font-bold text-xl mb-2 text-base-content">
              Curated Recommendations
            </h3>
            <p className="text-sm text-base-content/75 leading-relaxed">
              Handpicked editions and forgotten literary gems chosen by lifelong
              readers, not faceless algorithms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-base-100 border border-base-300 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-xl mb-4">
              <FiHeart />
            </div>
            <h3 className="font-serif font-bold text-xl mb-2 text-base-content">
              Cozy Community
            </h3>
            <p className="text-sm text-base-content/75 leading-relaxed">
              Connect with thoughtful book lovers, exchange notes in margins,
              and discuss your favorite prose.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-base-100 border border-base-300 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl mb-4">
              <FiCheckCircle />
            </div>
            <h3 className="font-serif font-bold text-xl mb-2 text-base-content">
              Two Warm Themes
            </h3>
            <p className="text-sm text-base-content/75 leading-relaxed">
              Seamlessly toggle between <span className="font-semibold text-primary">booknook-light</span> (paper-cream)
              and <span className="font-semibold text-secondary">booknook-dark</span> (nocturnal library oak).
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default HomeContent;

