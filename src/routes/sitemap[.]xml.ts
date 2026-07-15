import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { siteUrl } from "@/lib/seo";

const INDEXABLE_PATHS = [
  "/",
  "/kolo",
  "/zebricek",
  "/o-nas",
  "/kontakt",
  "/faq",
  "/ochrana-osobnich-udaju",
  "/podminky",
  "/cookies",
  "/zodpovedna-hra",
  "/smazani-uctu",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...INDEXABLE_PATHS.map((path) => `  <url><loc>${siteUrl(path)}</loc></url>`),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
