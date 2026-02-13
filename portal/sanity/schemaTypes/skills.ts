import { defineType, defineField } from 'sanity'

export const skills = defineType({
  name: 'skills',
  title: 'Skills',
  type: 'document',
  fields: [
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'string',
      description: 'Space-separated list of skills (e.g. "CSS HTML JavaScript React")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'highlights',
      title: 'Highlighted Skills',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Skills to visually highlight in the falling text animation',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Skills' }),
  },
})
