/**
 * Supabase Image Transformations helper
 * Docs: https://supabase.com/docs/guides/storage/image-transformations
 *
 * Enable in Dashboard: Storage → Settings → Image Transformations
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  resize?: "cover" | "contain" | "fill";
  quality?: number;
  format?: "auto" | "origin" | "avif" | "webp" | "jpeg";
}

/**
 * Apply Supabase image transformations to a storage public URL.
 * Falls back to original URL if not a Supabase storage URL.
 */
export function getImageUrl(
  url: string | null | undefined,
  options: ImageTransformOptions = {}
): string {
  if (!url) return "";

  const isSupabaseStorage = url.includes("/storage/v1/object/public/");
  if (!isSupabaseStorage) return url;

  const { width, height, resize = "cover", quality, format = "auto" } = options;

  const params = new URLSearchParams();
  if (width) params.set("width", String(width));
  if (height) params.set("height", String(height));
  if (resize) params.set("resize", resize);
  if (quality) params.set("quality", String(quality));
  if (format) params.set("format", format);

  const query = params.toString();
  return query ? `${url}?${query}` : url;
}

/**
 * Generate a srcset string for responsive images.
 * Example: getSrcSet(url, [{w:320,h:200},{w:640,h:400}])
 */
export function getSrcSet(
  url: string | null | undefined,
  sizes: Array<{ width: number; height?: number }>,
  baseOptions: Omit<ImageTransformOptions, "width" | "height"> = {}
): string {
  if (!url) return "";

  return sizes
    .map(({ width, height }) => {
      const imageUrl = getImageUrl(url, { ...baseOptions, width, height });
      return `${imageUrl} ${width}w`;
    })
    .join(", ");
}

/* ── Presets for common use-cases ── */

/** Card thumbnail: 16:10 aspect ratio */
export function getCardImageUrl(url: string | null | undefined): string {
  return getImageUrl(url, { width: 640, height: 400, resize: "cover", format: "auto" });
}

export function getCardSrcSet(url: string | null | undefined): string {
  return getSrcSet(url, [{ width: 320, height: 200 }, { width: 640, height: 400 }], {
    resize: "cover",
    format: "auto",
  });
}

/** Lesson hero: wide banner */
export function getHeroImageUrl(url: string | null | undefined): string {
  return getImageUrl(url, { width: 1200, height: 450, resize: "cover", format: "auto" });
}

export function getHeroSrcSet(url: string | null | undefined): string {
  return getSrcSet(
    url,
    [
      { width: 640, height: 240 },
      { width: 960, height: 360 },
      { width: 1200, height: 450 },
      { width: 1920, height: 720 },
    ],
    { resize: "cover", format: "auto" }
  );
}

/** Admin table thumbnail: small square-ish */
export function getThumbImageUrl(url: string | null | undefined): string {
  return getImageUrl(url, { width: 120, height: 120, resize: "cover", format: "auto" });
}

/** Full-width article/blog image */
export function getArticleImageUrl(url: string | null | undefined): string {
  return getImageUrl(url, { width: 800, height: 420, resize: "cover", format: "auto" });
}

/** Avatar / small profile image */
export function getAvatarImageUrl(url: string | null | undefined): string {
  return getImageUrl(url, { width: 96, height: 96, resize: "cover", format: "auto" });
}
