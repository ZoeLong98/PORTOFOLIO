import { defineType, defineField } from 'sanity'

export const projectCategory = defineType({
  name: 'projectCategory',
  title: 'Project Category',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category Name',
      type: 'string',
      description: 'e.g. "Web Development", "Mobile Apps"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
    }),
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Screenshot / Thumbnail',
              type: 'image',
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'techStack',
              title: 'Tech Stack',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Technologies used (e.g. "GSAP", "Three.js")',
            }),
            defineField({
              name: 'href',
              title: 'Project URL',
              type: 'url',
              description: 'Link to live project (optional)',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'category' },
  },
})
