"use client";

import React from "react";
import { motion } from "framer-motion";
import { HomeHeroSlider } from "./HomeHeroSlider";
import { NewArrivals } from "./NewArrivals";
import { HowItWorks } from "./HowItWorks";
import { TopCategories } from "./TopCategories";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HomeContent() {
  return (
    <div className="flex-1 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HomeHeroSlider />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <NewArrivals />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <HowItWorks />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <TopCategories />
      </motion.div>
    </div>
  );
}

export default HomeContent;
