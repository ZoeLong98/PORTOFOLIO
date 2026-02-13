"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteData } from "@/data/types";
import {
  HeroSection,
  SkillsSection,
  WorkSection,
  AboutSection,
  ContactSection,
  SectionHeading_Clickable,
} from "./sections";

type MobileLayoutProps = {
  siteData: SiteData;
  expandedSection: "work" | "about" | null;
  setExpandedSection: (section: "work" | "about" | null) => void;
};

export default function MobileLayout({
  siteData,
  expandedSection,
  setExpandedSection,
}: MobileLayoutProps) {
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

  const workRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWorkExpand = () => {
    if (expandedSection === "work") {
      setExpandedSection(null);
    } else {
      const rect = workRef.current?.getBoundingClientRect();
      if (rect) setSourceRect(rect);
      setExpandedSection("work");
    }
  };

  const handleAboutExpand = () => {
    if (expandedSection === "about") {
      setExpandedSection(null);
    } else {
      const rect = aboutRef.current?.getBoundingClientRect();
      if (rect) setSourceRect(rect);
      setExpandedSection("about");
    }
  };

  const getClipFrom = () => {
    if (!sourceRect) return "inset(0px 0px 0px 0px)";
    const top = Math.round(sourceRect.top);
    const right = Math.round(window.innerWidth - sourceRect.right);
    const bottom = Math.round(window.innerHeight - sourceRect.bottom);
    const left = Math.round(sourceRect.left);
    return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
  };

  const clipFrom = getClipFrom();

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Mobile column layout */}
      <div
        className="grid h-full"
        style={{
          gridTemplateRows:
            "minmax(0, 2.5fr) minmax(0, 2.5fr) minmax(0, 0.7fr) minmax(0, 0.7fr) minmax(0, 1.5fr)",
        }}
      >
        {/* Hero Section */}
        <div className="overflow-hidden border-b border-black px-6 py-6">
          <HeroSection data={siteData.hero} />
        </div>

        {/* Skills Section */}
        <div className="overflow-hidden border-b border-black px-6 py-6">
          <SkillsSection data={siteData.skills} />
        </div>

        {/* Work Section */}
        <div
          ref={workRef}
          className="flex cursor-pointer items-center justify-between overflow-hidden border-b border-black bg-white px-6 transition-colors duration-200 hover:bg-gray-50"
        >
          <SectionHeading_Clickable onClick={handleWorkExpand}>
            Work
          </SectionHeading_Clickable>
          <div onClick={handleWorkExpand} className="text-xl">
            +
          </div>
        </div>

        {/* About Section */}
        <div
          ref={aboutRef}
          className="flex cursor-pointer items-center justify-between overflow-hidden border-b border-black bg-white px-6 transition-colors duration-200 hover:bg-gray-50"
        >
          <SectionHeading_Clickable onClick={handleAboutExpand}>
            About Me
          </SectionHeading_Clickable>
          <div onClick={handleAboutExpand} className="text-xl">
            +
          </div>
        </div>

        {/* Contact Section */}
        <div className="overflow-hidden bg-white px-6 py-6">
          <ContactSection data={siteData.contact} />
        </div>
      </div>

      {/* Expanded overlay - clipPath grows from source position */}
      <AnimatePresence>
        {expandedSection === "work" && (
          <motion.div
            key="work-expanded"
            className="fixed inset-0 z-50 bg-white"
            initial={{ clipPath: clipFrom }}
            animate={{ clipPath: "inset(0px 0px 0px 0px)" }}
            exit={{ clipPath: clipFrom }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              className="h-full overflow-auto p-6"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.35, delay: 0.08 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <WorkSection data={siteData.projectCategories} onExpand={handleWorkExpand} isExpanded={true} />
            </motion.div>
          </motion.div>
        )}
        {expandedSection === "about" && (
          <motion.div
            key="about-expanded"
            className="fixed inset-0 z-50 bg-white"
            initial={{ clipPath: clipFrom }}
            animate={{ clipPath: "inset(0px 0px 0px 0px)" }}
            exit={{ clipPath: clipFrom }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              className="h-full overflow-auto p-6"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.35, delay: 0.08 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <AboutSection data={siteData.about} onExpand={handleAboutExpand} isExpanded={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
