import { defineType, defineField } from 'sanity'

export const siteContact = defineType({
  name: 'siteContact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'entries',
      title: 'Contact Entries',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              description: 'Contact method (e.g. "Email", "Phone", "LinkedIn")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Display Value',
              type: 'string',
              description: 'The text shown to visitors (e.g. "zeyulong0908@gmail.com")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Full URL or mailto: link',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'type', subtitle: 'value' },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact' }),
  },
})
