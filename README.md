# Created by Alvin

Private working draft of Alvin's website service for small businesses.

```sh
npm run build
npm run check
npm run preview
```

The draft uses `inbox@createdbyalvin.com` for website enquiries. Before a public launch, choose the final business name and domain, confirm the service scope and pricing model, and connect the final domain.

Search engines are allowed: the build writes an open `robots.txt` and a `sitemap.xml` for `https://createdbyalvin.com` (`siteUrl` in `scripts/build.mjs`), and only the generated 404 page is `noindex`.

The page is intentionally static and portable. Supabase can be added later for shared client content, image storage, and an internal management system without making this marketing page dependent on it.
