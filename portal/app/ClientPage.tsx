"use client";

import { useState, useEffect } from "react";
import type { SiteData } from "@/data/types";
import MobileLayout from "../components/MobileLayout";
import LaptopLayout from "../components/LaptopLayout";

type ExpandedSection = "work" | "about" | null;

export default function ClientPage({ siteData }: { siteData: SiteData }) {
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);

  // Reset expanded state on breakpoint change to avoid stale overlays
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setExpandedSection(null);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <MobileLayout
          siteData={siteData}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <LaptopLayout
          siteData={siteData}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
      </div>
    </div>
  );
}
