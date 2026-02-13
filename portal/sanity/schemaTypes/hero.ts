import { defineType, defineField } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'greeting',
      title: 'Greeting',
      type: 'string',
      description: 'Main greeting text (e.g. "Hi, I am Zoe")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titles',
      title: 'Titles',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Rotating titles displayed below the greeting',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'greeting' },
  },
})
