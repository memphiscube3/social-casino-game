export const SITE_ORIGIN = "https://junglecircle.cz";

export function siteUrl(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${normalizedPath}`;
}

export function canonicalLink(pathname: string) {
  return { rel: "canonical", href: siteUrl(pathname) };
}

export function openGraphUrl(pathname: string) {
  return { property: "og:url", content: siteUrl(pathname) };
}

export const noIndexMeta = { name: "robots", content: "noindex, follow" } as const;
