import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes all potentially dangerous HTML tags and attributes
 *
 * @param dirty - The unsanitized HTML string
 * @returns Sanitized HTML string safe for display
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";

  // Configure DOMPurify to be strict
  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  return clean;
}

/**
 * Sanitizes plain text by stripping all HTML tags
 * Use this for fields that should never contain HTML
 *
 * @param text - The text that may contain HTML
 * @returns Plain text with all HTML removed
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";

  // Strip all HTML tags
  const clean = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });

  return clean.trim();
}

/**
 * Validates and sanitizes file upload URLs
 * Ensures URLs are valid and from allowed domains
 *
 * @param url - The URL to validate
 * @param allowedDomains - Optional list of allowed domains
 * @returns Sanitized URL or throws error if invalid
 */
export function sanitizeFileUrl(
  url: string,
  allowedDomains?: string[],
): string {
  try {
    const parsedUrl = new URL(url);

    // Only allow https protocol
    if (parsedUrl.protocol !== "https:") {
      throw new Error("Only HTTPS URLs are allowed");
    }

    // Check allowed domains if specified
    if (allowedDomains && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(
        (domain) =>
          parsedUrl.hostname === domain ||
          parsedUrl.hostname.endsWith(`.${domain}`),
      );

      if (!isAllowed) {
        throw new Error(`Domain ${parsedUrl.hostname} is not allowed`);
      }
    }

    return parsedUrl.toString();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid URL format");
    }
    throw error;
  }
}

/**
 * Validates image file extensions
 *
 * @param url - The image URL to validate
 * @returns True if valid image extension
 */
export function isValidImageUrl(url: string): boolean {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const lowerUrl = url.toLowerCase();

  return validExtensions.some((ext) => lowerUrl.includes(ext));
}
