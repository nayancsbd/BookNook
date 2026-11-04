import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "BookNook | Home",
  description:
    "A warm, inviting sanctuary for book lovers. Explore handpicked books, literary collections, and a warm reading community.",
};

export default function HomePage() {
  return <HomeContent />;
}
