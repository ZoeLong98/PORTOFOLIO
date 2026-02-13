import { type SchemaTypeDefinition } from 'sanity'

import { hero } from './hero'
import { skills } from './skills'
import { about } from './about'
import { siteContact } from './siteContact'
import { projectCategory } from './projectCategory'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hero, skills, about, siteContact, projectCategory],
}
