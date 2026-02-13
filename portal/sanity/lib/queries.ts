import { defineQuery } from 'next-sanity'

export const heroQuery = defineQuery(
  `*[_type == "hero" && _id == "hero"][0]{ greeting, titles }`,
)

export const skillsQuery = defineQuery(
  `*[_type == "skills" && _id == "skills"][0]{ skills, highlights }`,
)

export const aboutQuery = defineQuery(
  `*[_type == "about" && _id == "about"][0]{
    "image": image.asset->url,
    imageAlt,
    text
  }`,
)

export const contactQuery = defineQuery(
  `*[_type == "siteContact" && _id == "siteContact"][0]{
    entries[]{ type, value, href }
  }`,
)

export const projectCategoriesQuery = defineQuery(
  `*[_type == "projectCategory"] | order(order asc) {
    category,
    projects[]{
      title,
      "image": image.asset->url,
      techStack,
      href
    }
  }`,
)
