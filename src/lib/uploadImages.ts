import { StagedImage } from "@/components/admin/StagedImageUpload";

interface UploadParams {
  gender: string;
  categorySlug: string;
  productSlug: string;
  sku: string;
}

interface UploadResult {
  url: string;
  publicId?: string;
  color?: string;
  position: number;
}

/**
 * Upload staged images to Cloudinary with proper folder structure
 */
export async function uploadStagedImages(
  stagedImages: StagedImage[],
  params: UploadParams,
  onProgress?: (current: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < stagedImages.length; i++) {
    const image = stagedImages[i];

    // Progress callback
    onProgress?.(i + 1, stagedImages.length);

    try {
      const formData = new FormData();
      formData.append("file", image.file);
      formData.append("folder", "halikarnas/products");
      formData.append("gender", params.gender.toLowerCase());
      formData.append("categorySlug", params.categorySlug);
      formData.append("productSlug", params.productSlug);
      formData.append("sku", params.sku);
      if (image.color) {
        formData.append("color", image.color);
      }
      formData.append("imageIndex", String(i + 1));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        results.push({
          url: data.url,
          publicId: data.publicId,
          color: image.color || undefined,
          position: i,
        });
      } else {
        console.error(`Gorsel ${i + 1} yuklenemedi:`, data.error);
      }
    } catch (error) {
      console.error(`Gorsel ${i + 1} yuklenemedi:`, error);
      // Continue with other images even if one fails
    }
  }

  return results;
}

/**
 * Clean up blob URLs to free memory
 */
export function cleanupStagedImages(stagedImages: StagedImage[]): void {
  stagedImages.forEach((img) => {
    try {
      URL.revokeObjectURL(img.previewUrl);
    } catch {
      // Ignore errors during cleanup
    }
  });
}
