import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rentride.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/renter/", "/owner/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
