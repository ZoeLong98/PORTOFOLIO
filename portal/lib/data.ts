import type { SiteData } from "@/data/types";
import {
  heroData,
  skillsData,
  aboutData,
  contactData,
  projectCategories,
} from "@/data/content";
import { client } from "@/sanity/lib/client";
import {
  heroQuery,
  skillsQuery,
  aboutQuery,
  contactQuery,
  projectCategoriesQuery,
} from "@/sanity/lib/queries";

const USE_SANITY = process.env.NEXT_PUBLIC_USE_SANITY === "true";

/**
 * Fetches all site data from either Sanity or local content.ts,
 * controlled by the NEXT_PUBLIC_USE_SANITY environment variable.
 */
export async function getSiteData(): Promise<SiteData> {
  if (!USE_SANITY) {
    return {
      hero: heroData,
      skills: skillsData,
      about: aboutData,
      contact: contactData,
      projectCategories,
    };
  }

  const [hero, skills, about, contact, categories] = await Promise.all([
    client.fetch(heroQuery),
    client.fetch(skillsQuery),
    client.fetch(aboutQuery),
    client.fetch(contactQuery),
    client.fetch(projectCategoriesQuery),
  ]);

  return {
    hero: hero ?? heroData,
    skills: skills ?? skillsData,
    about: about ?? aboutData,
    contact: contact?.entries ?? contactData,
    projectCategories: categories?.length ? categories : projectCategories,
  };
}
