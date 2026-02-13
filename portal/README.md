# Portal - Portfolio

A Next.js portfolio site with an integrated Sanity CMS. Content can be served from either Sanity or a local static file (`data/content.ts`), controlled by a single environment variable.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Sanity CMS

### Project Structure

```
sanity/
  schemaTypes/       # Document schemas (hero, skills, about, siteContact, projectCategory)
  lib/
    client.ts        # Sanity client
    queries.ts       # GROQ queries
    image.ts         # Image URL builder
  env.ts             # Environment variable helpers
  structure.ts       # Studio sidebar structure (singletons + lists)
data/
  types.ts           # Shared TypeScript types used by both local data and Sanity
  content.ts         # Local fallback data
lib/
  data.ts            # Unified data layer (reads USE_SANITY flag)
```

### Configure Environment

Copy the example file and fill in your Sanity project credentials:

```bash
cp .env.example .env.local
```

Required variables in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_USE_SANITY="false"
```

### Run Sanity Studio Locally

Sanity Studio is embedded in the Next.js app at the `/studio` route. No separate process is needed.

1. Start the dev server: `npm run dev`
2. Open [http://localhost:3000/studio](http://localhost:3000/studio)
3. Log in with your Sanity account
4. Add content for each section: Hero, Skills, About, Contact, and Project Categories

### Connect Sanity to the Site

The data layer (`lib/data.ts`) handles this automatically. When `NEXT_PUBLIC_USE_SANITY` is `"true"`, it fetches from Sanity via GROQ queries. When `"false"`, it returns the static data from `data/content.ts`.

The page is a server component that calls `getSiteData()` at render time, so switching data sources requires no component changes.

### Toggle Between Sanity and Local Data

In `.env.local`, set the flag:

```env
# Use Sanity CMS as the data source
NEXT_PUBLIC_USE_SANITY="true"

# Use local data/content.ts instead
NEXT_PUBLIC_USE_SANITY="false"
```

Restart the dev server after changing this value.

When Sanity is enabled but a section is missing data (e.g. the document hasn't been created yet), the site falls back to the corresponding local data for that section.

### Deploy the CMS

Sanity Studio ships as part of the Next.js build. No separate deployment step is needed.

1. Ensure `.env.local` variables are set in your hosting provider (e.g. Vercel environment variables)
2. Set `NEXT_PUBLIC_USE_SANITY="true"` in your production environment
3. Deploy the Next.js app as usual (`npm run build` or via Git integration)
4. The studio will be accessible at `your-domain.com/studio`

To manage CORS origins (required for the studio to communicate with Sanity's API):

```bash
npx sanity cors add https://your-domain.com
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
