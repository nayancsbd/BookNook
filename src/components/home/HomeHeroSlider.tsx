"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface SlideData {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  bgImage: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: "slide_1",
    eyebrow: "Welcome to the Sanctuary",
    title: "A Haven for Incurable Readers",
    text: "Curl up with timeless classics, modern masterpieces, and forgotten stories waiting to be rediscovered on quiet evenings.",
    bgImage:
      "https://images.unsplash.com/photo-1507842229451-7f01be777a26?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "slide_2",
    eyebrow: "Community Library Movement",
    title: "Share the Joy of Open Borrowing",
    text: "Contribute treasured volumes from your personal shelves and borrow captivating editions with fellow passionate bibliophiles.",
    bgImage:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1920",
  },
  {
    id: "slide_3",
    eyebrow: "Handpicked Collections",
    title: "Curated Shelves for Every Curious Mind",
    text: "From ancient historical chronicles to speculative fiction and natural sciences, find the perfect volume for your reading nook.",
    bgImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1920",
  },
];

export function HomeHeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-base-300">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "!bg-secondary !w-8 !opacity-100",
          bulletClass:
            "inline-block w-2.5 h-2.5 mx-1 rounded-full bg-base-100/60 opacity-60 transition-all duration-300 cursor-pointer",
        }}
        navigation={true}
        loop={true}
        className="w-full h-[520px] sm:h-[580px] lg:h-[640px] booknook-hero-swiper"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral/95 via-neutral/80 to-transparent" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral/20 to-neutral/90" />

            <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
              <div className="max-w-2xl text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/30 border border-primary/40 text-primary-content text-xs font-semibold tracking-wider uppercase font-sans backdrop-blur-sm">
                  <FiBookOpen className="w-3.5 h-3.5" />
                  <span>{slide.eyebrow}</span>
                </div>

                <Heading
                  as="h1"
                  size="hero"
                  className="text-white text-3xl sm:text-5xl lg:text-6xl drop-shadow-sm leading-tight"
                >
                  {slide.title}
                </Heading>

                <p className="text-base sm:text-lg text-white/85 font-sans leading-relaxed max-w-xl">
                  {slide.text}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <Button
                    href="/books"
                    variant="primary"
                    size="lg"
                    icon={<FiArrowRight />}
                    iconPosition="right"
                    className="shadow-xl"
                  >
                    Browse Books
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HomeHeroSlider;

