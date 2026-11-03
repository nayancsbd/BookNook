import React from "react";
import { FiBookOpen } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-base-100 text-base-content">
      <div className="relative flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <FiBookOpen className="absolute text-primary/80 text-xl" />
      </div>
      <p className="font-serif italic text-base sm:text-lg text-base-content/75 animate-pulse">
        Gathering volumes from the library shelves...
      </p>
    </div>
  );
}

