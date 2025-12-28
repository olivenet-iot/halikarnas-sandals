/**
 * Cloudinary URL optimization utility
 * Adds transformation parameters for optimal image delivery
 */

interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:low" | "auto:eco" | "auto:good" | "auto:best";
  format?: "auto" | "webp" | "avif";
  crop?: "fill" | "fit" | "scale" | "crop";
}

/**
 * Optimize Cloudinary URLs with transformation parameters
 * Returns original URL for non-Cloudinary images
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: OptimizeOptions = {}
): string {
  // Return original if not a Cloudinary URL
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  const {
    width,
    height,
    quality = "auto:good",
    format = "auto",
    crop = "fill",
  } = options;

  // Build transformation string
  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push(`c_${crop}`);

  const transformString = transformations.join(",");

  // Insert after /upload/
  return url.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Get optimized URL for thumbnail images
 */
export function getThumbnailUrl(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 100,
    height: 100,
    quality: "auto:good",
  });
}

/**
 * Get optimized URL for main product images
 */
export function getProductImageUrl(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 800,
    height: 1000,
    quality: "auto:good",
  });
}

/**
 * Get optimized URL for collection card thumbnails
 */
export function getCollectionThumbnailUrl(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 600,
    height: 800,
    quality: "auto:good",
  });
}

/**
 * Get optimized URL for collection hero banners (full-width)
 */
export function getCollectionHeroUrl(url: string): string {
  return optimizeCloudinaryUrl(url, {
    width: 1920,
    height: 800,
    quality: "auto:good",
  });
}
