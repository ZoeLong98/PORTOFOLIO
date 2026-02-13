import type {
  HeroData,
  SkillsData,
  AboutData,
  ContactEntry,
  ProjectCategory,
} from "./types";

// Re-export types so existing imports keep working.
export type { ContactEntry, Project, ProjectCategory } from "./types";

// ─── Hero ────────────────────────────────────────────────────
export const heroData: HeroData = {
  greeting: "Hi, I am Zoe",
  titles: ["A Full-stack Developer", "A UX Researcher", "A Design Hobbyist"],
};

// ─── Skills ──────────────────────────────────────────────────
export const skillsData: SkillsData = {
  skills:
    "CSS HTML JavaScript Node.js Python React SQL Tailwind Three.js TypeScript Figma",
  highlights: ["JavaScript", "React", "Three.js"],
};

// ─── About ───────────────────────────────────────────────────
export const aboutData: AboutData = {
  image: "/Pic.png",
  imageAlt: "Zoe - Character Illustration",
  text: `Currently pursuing my master's degree at San Francisco State University, majoring in Data Science and Artificial Intelligence. Passionate about interactive frontend development and curious about user experience.`,
};

// ─── Contact ─────────────────────────────────────────────────
export const contactData: ContactEntry[] = [
  {
    type: "Email",
    value: "zeyulong0908@gmail.com",
    href: "mailto:zeyulong0908@gmail.com",
  },
];

// ─── Work / Projects ─────────────────────────────────────────
export const projectCategories: ProjectCategory[] = [
  {
    category: "Web Development",
    projects: [
      {
        title: "Emotion",
        image: "/projects/emotion.png",
        techStack: ["GSAP", "Three.js"],
        href: "https://emotion-xi.vercel.app/",
      },
    ],
  },
];
