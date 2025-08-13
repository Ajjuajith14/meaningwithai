import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/debug/", "/auth/", "/_next/", "/private/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/debug/", "/auth/", "/private/"],
      },
    ],
    sitemap: "https://visualizedictionary.com/sitemap.xml",
    host: "https://visualizedictionary.com",
  }
}
