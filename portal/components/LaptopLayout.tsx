"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import type { SiteData } from "@/data/types";
import {
  HeroSection,
  SkillsSection,
  WorkSection,
  AboutSection,
  ContactSection,
} from "./sections";

type PanelSizes = {
  topHeight: number; // percentage for top section (Hero | Skills)
  topLeftWidth: number; // percentage for Hero width in top section
  bottomLeftWidth: number; // percentage for Work width in bottom section
  bottomRightTopHeight: number; // percentage for About in bottom-right section
};

type ResizableLayoutProps = {
  siteData: SiteData;
  expandedSection: "work" | "about" | null;
  setExpandedSection: (section: "work" | "about" | null) => void;
};

const CONSTRAINTS = {
  minTopHeight: 15,
  maxTopHeight: 40,
  minLeftWidth: 30,
  maxLeftWidth: 70,
  minAboutHeight: 30,
  maxAboutHeight: 70,
};

export default function ResizableLayout({
  siteData,
  expandedSection,
  setExpandedSection,
}: ResizableLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

  // Refs for panel containers (used to capture bounding rect for expansion)
  const workPanelRef = useRef<HTMLDivElement>(null);
  const aboutPanelRef = useRef<HTMLDivElement>(null);

  const handleWorkExpand = useCallback(() => {
    if (expandedSection === "work") {
      setExpandedSection(null);
    } else {
      const rect = workPanelRef.current?.getBoundingClientRect();
      if (rect) setSourceRect(rect);
      setExpandedSection("work");
    }
  }, [expandedSection]);

  const handleAboutExpand = useCallback(() => {
    if (expandedSection === "about") {
      setExpandedSection(null);
    } else {
      const rect = aboutPanelRef.current?.getBoundingClientRect();
      if (rect) setSourceRect(rect);
      setExpandedSection("about");
    }
  }, [expandedSection]);

  const getClipFrom = () => {
    if (!sourceRect || typeof window === "undefined")
      return "inset(0px 0px 0px 0px)";
    const top = Math.round(sourceRect.top);
    const right = Math.round(window.innerWidth - sourceRect.right);
    const bottom = Math.round(window.innerHeight - sourceRect.bottom);
    const left = Math.round(sourceRect.left);
    return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
  };

  const clipFrom = getClipFrom();

  const [sizes, setSizes] = useState<PanelSizes>({
    topHeight: 25,
    topLeftWidth: 55,
    bottomLeftWidth: 40,
    bottomRightTopHeight: 60,
  });
  const targetSizes = useRef<PanelSizes>({
    topHeight: 25,
    topLeftWidth: 55,
    bottomLeftWidth: 40,
    bottomRightTopHeight: 60,
  });
  const rafId = useRef<number | null>(null);
  const LERP_FACTOR = 0.15;
  const [isDragging, setIsDragging] = useState<
    | "horizontal-main"
    | "vertical-top"
    | "vertical-bottom"
    | "horizontal-bottom-right"
    | null
  >(null);

  // Animation refs for lines
  const mainHLineRef = useRef<HTMLDivElement>(null);
  const topVLineRef = useRef<HTMLDivElement>(null);
  const bottomVLineRef = useRef<HTMLDivElement>(null);
  const bottomRightHLineRef = useRef<HTMLDivElement>(null);

  // Animation refs for content
  const heroContentRef = useRef<HTMLDivElement>(null);
  const skillsContentRef = useRef<HTMLDivElement>(null);
  const workContentRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const contactContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Set initial states
      gsap.set(
        [
          mainHLineRef.current,
          topVLineRef.current,
          bottomVLineRef.current,
          bottomRightHLineRef.current,
        ],
        { scaleX: 0, scaleY: 0 },
      );
      gsap.set(mainHLineRef.current, { scaleX: 0, scaleY: 1 });
      gsap.set(bottomRightHLineRef.current, { scaleX: 0, scaleY: 1 });
      gsap.set([topVLineRef.current, bottomVLineRef.current], {
        scaleY: 0,
        scaleX: 1,
      });
      gsap.set(
        [
          heroContentRef.current,
          skillsContentRef.current,
          workContentRef.current,
          aboutContentRef.current,
          contactContentRef.current,
        ],
        { opacity: 0, y: 20 },
      );

      // Animation sequence
      tl.to(mainHLineRef.current, {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          [topVLineRef.current, bottomVLineRef.current],
          {
            scaleY: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2",
        )
        .to(
          bottomRightHLineRef.current,
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2",
        )
        .to(
          [
            heroContentRef.current,
            skillsContentRef.current,
            workContentRef.current,
            aboutContentRef.current,
            contactContentRef.current,
          ],
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3",
        );
    });

    return () => ctx.revert();
  }, []);

  const handleMouseDown = useCallback(
    (
      divider:
        | "horizontal-main"
        | "vertical-top"
        | "vertical-bottom"
        | "horizontal-bottom-right",
    ) => {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(divider);
      };
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      if (isDragging === "horizontal-main") {
        const newTopHeight = ((e.clientY - rect.top) / rect.height) * 100;
        targetSizes.current.topHeight = Math.min(
          CONSTRAINTS.maxTopHeight,
          Math.max(CONSTRAINTS.minTopHeight, newTopHeight),
        );
      } else if (isDragging === "vertical-top") {
        const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
        targetSizes.current.topLeftWidth = Math.min(
          CONSTRAINTS.maxLeftWidth,
          Math.max(CONSTRAINTS.minLeftWidth, newLeftWidth),
        );
      } else if (isDragging === "vertical-bottom") {
        const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
        targetSizes.current.bottomLeftWidth = Math.min(
          CONSTRAINTS.maxLeftWidth,
          Math.max(CONSTRAINTS.minLeftWidth, newLeftWidth),
        );
      } else if (isDragging === "horizontal-bottom-right") {
        const topOffset = (targetSizes.current.topHeight / 100) * rect.height;
        const bottomHeight = rect.height - topOffset;
        const mouseY = e.clientY - rect.top - topOffset;
        const newAboutHeight = (mouseY / bottomHeight) * 100;
        targetSizes.current.bottomRightTopHeight = Math.min(
          CONSTRAINTS.maxAboutHeight,
          Math.max(CONSTRAINTS.minAboutHeight, newAboutHeight),
        );
      }
    },
    [isDragging],
  );

  // Animation loop: lerp sizes toward target for damping effect
  useEffect(() => {
    if (!isDragging) {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      // Snap to final target on release
      setSizes({ ...targetSizes.current });
      return;
    }

    const animate = () => {
      setSizes((prev) => {
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        return {
          topHeight: lerp(
            prev.topHeight,
            targetSizes.current.topHeight,
            LERP_FACTOR,
          ),
          topLeftWidth: lerp(
            prev.topLeftWidth,
            targetSizes.current.topLeftWidth,
            LERP_FACTOR,
          ),
          bottomLeftWidth: lerp(
            prev.bottomLeftWidth,
            targetSizes.current.bottomLeftWidth,
            LERP_FACTOR,
          ),
          bottomRightTopHeight: lerp(
            prev.bottomRightTopHeight,
            targetSizes.current.bottomRightTopHeight,
            LERP_FACTOR,
          ),
        };
      });
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isDragging, LERP_FACTOR]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isDragging.startsWith("horizontal")
        ? "row-resize"
        : "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const bottomHeight = 100 - sizes.topHeight;

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* ===== TOP SECTION (Hero | Skills) ===== */}
      <div
        className="absolute left-0 right-0 top-0 flex"
        style={{ height: `${sizes.topHeight}%` }}
      >
        {/* Hero Section */}
        <div
          className="relative h-full overflow-auto"
          style={{ width: `${sizes.topLeftWidth}%` }}
        >
          <div ref={heroContentRef} className="h-full p-4">
            <HeroSection data={siteData.hero} />
          </div>
        </div>

        {/* Vertical Divider (Top Section) */}
        <div
          className="group relative z-10 flex h-full w-0 cursor-col-resize items-center justify-center"
          onMouseDown={handleMouseDown("vertical-top")}
        >
          <div
            ref={topVLineRef}
            className={`absolute h-full w-px origin-top bg-black ${
              isDragging === "vertical-top"
                ? "w-1 bg-gray-400"
                : "group-hover:w-1 group-hover:bg-gray-400"
            }`}
          />
        </div>

        {/* Skills Section */}
        <div
          className="relative h-full overflow-auto"
          style={{ width: `${100 - sizes.topLeftWidth}%` }}
        >
          <div ref={skillsContentRef} className="h-full p-4">
            <SkillsSection data={siteData.skills} />
          </div>
        </div>
      </div>

      {/* Horizontal Divider (Main - between Top and Bottom) */}
      <div
        className="group absolute left-0 right-0 z-10 flex h-0 cursor-row-resize items-center justify-center"
        style={{ top: `${sizes.topHeight}%` }}
        onMouseDown={handleMouseDown("horizontal-main")}
      >
        <div
          ref={mainHLineRef}
          className={`absolute h-px w-full origin-left bg-black ${
            isDragging === "horizontal-main"
              ? "h-1 bg-gray-400"
              : "group-hover:h-1 group-hover:bg-gray-400"
          }`}
        />
      </div>

      {/* ===== BOTTOM SECTION (Work | About + Contact) ===== */}
      <div
        className="absolute bottom-0 left-0 right-0 flex"
        style={{ height: `${bottomHeight}%` }}
      >
        {/* Work Section (Left) */}
        <div
          ref={workPanelRef}
          className="relative h-full overflow-auto"
          style={{ width: `${sizes.bottomLeftWidth}%` }}
        >
          <div ref={workContentRef} className="h-full p-4">
            <WorkSection data={siteData.projectCategories} onExpand={handleWorkExpand} />
          </div>
        </div>

        {/* Vertical Divider (Bottom Section) */}
        <div
          className="group relative z-10 flex h-full w-0 cursor-col-resize items-center justify-center"
          onMouseDown={handleMouseDown("vertical-bottom")}
        >
          <div
            ref={bottomVLineRef}
            className={`absolute h-full w-px origin-top bg-black ${
              isDragging === "vertical-bottom"
                ? "w-1 bg-gray-400"
                : "group-hover:w-1 group-hover:bg-gray-400"
            }`}
          />
        </div>

        {/* Right Section (About + Contact) */}
        <div
          className="relative h-full"
          style={{ width: `${100 - sizes.bottomLeftWidth}%` }}
        >
          {/* About Section */}
          <div
            ref={aboutPanelRef}
            className="absolute left-0 right-0 top-0 overflow-auto"
            style={{ height: `${sizes.bottomRightTopHeight}%` }}
          >
            <div ref={aboutContentRef} className="h-full p-4">
              <AboutSection data={siteData.about} onExpand={handleAboutExpand} />
            </div>
          </div>

          {/* Horizontal Divider (About/Contact) */}
          <div
            className="group absolute left-0 right-0 z-10 flex h-0 cursor-row-resize items-center justify-center"
            style={{ top: `${sizes.bottomRightTopHeight}%` }}
            onMouseDown={handleMouseDown("horizontal-bottom-right")}
          >
            <div
              ref={bottomRightHLineRef}
              className={`absolute h-px w-full origin-left bg-black ${
                isDragging === "horizontal-bottom-right"
                  ? "h-1 bg-gray-400"
                  : "group-hover:h-1 group-hover:bg-gray-400"
              }`}
            />
          </div>

          {/* Contact Section */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-auto"
            style={{ height: `${100 - sizes.bottomRightTopHeight}%` }}
          >
            <div ref={contactContentRef} className="h-full p-4">
              <ContactSection data={siteData.contact} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded overlay - clipPath grows from source panel position */}
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
              className="h-full overflow-auto p-8"
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
              className="h-full overflow-auto p-8"
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
