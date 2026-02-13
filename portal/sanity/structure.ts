import type { StructureResolver } from 'sanity/structure'

const singletonTypes = new Set(['hero', 'skills', 'about', 'siteContact'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Hero')
        .id('hero')
        .child(S.document().schemaType('hero').documentId('hero')),
      S.listItem()
        .title('Skills')
        .id('skills')
        .child(S.document().schemaType('skills').documentId('skills')),
      S.listItem()
        .title('About')
        .id('about')
        .child(S.document().schemaType('about').documentId('about')),
      S.listItem()
        .title('Contact')
        .id('siteContact')
        .child(
          S.document().schemaType('siteContact').documentId('siteContact'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() as string),
      ),
    ])
