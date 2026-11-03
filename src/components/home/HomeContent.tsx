"use client";

import React from "react";
import { HomeHeroSlider } from "./HomeHeroSlider";
import { NewArrivals } from "./NewArrivals";
import { HowItWorks } from "./HowItWorks";
import { TopCategories } from "./TopCategories";

export function HomeContent() {
  return (
    <div className="flex-1 flex flex-col">
      <HomeHeroSlider />
      <NewArrivals />
      <HowItWorks />
      <TopCategories />
    </div>
  );
}

export default HomeContent;
