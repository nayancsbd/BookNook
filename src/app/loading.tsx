import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner size="lg" label="Gathering volumes from the library shelves..." />
    </div>
  );
}
