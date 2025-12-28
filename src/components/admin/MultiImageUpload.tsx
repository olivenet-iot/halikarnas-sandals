"use client";

import { useState, useCallback } from "react";
import { Loader2, Images, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  onUpload: (urls: string[]) => void;
  maxImages?: number;
  currentCount?: number;
  folder?: string;
  gender?: string | null;
  category?: string;
  productSlug?: string;
  sku?: string;
  className?: string;
}

export function MultiImageUpload({
  onUpload,
  maxImages = 10,
  currentCount = 0,
  folder = "halikarnas/products",
  gender,
  category,
  productSlug,
  sku,
  className,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingSlots = maxImages - currentCount;

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (files.length === 0) return;

      setError(null);

      // Filter to only image files
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        setError("Lutfen gorsel dosyasi secin");
        return;
      }

      // Check file sizes
      const oversizedFiles = imageFiles.filter(
        (file) => file.size > 5 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError(`${oversizedFiles.length} dosya 5MB'dan buyuk`);
        return;
      }

      // Limit to remaining slots
      const filesToUpload = imageFiles.slice(0, remainingSlots);

      if (filesToUpload.length === 0) {
        setError(`Maksimum ${maxImages} gorsel yukleyebilirsiniz`);
        return;
      }

      if (filesToUpload.length < imageFiles.length) {
        setError(
          `${imageFiles.length - filesToUpload.length} gorsel limit nedeniyle atildi`
        );
      }

      setIsUploading(true);
      setTotalToUpload(filesToUpload.length);
      setUploadedCount(0);
      setUploadProgress(0);

      const uploadedUrls: string[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);

          if (gender) formData.append("gender", gender);
          if (category) formData.append("category", category);
          if (productSlug) formData.append("productSlug", productSlug);
          if (sku) formData.append("sku", sku);
          formData.append("imageIndex", String(currentCount + i + 1));

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            uploadedUrls.push(data.url);
          } else {
            console.error(`Upload failed for ${file.name}:`, data.error);
          }
        } catch (err) {
          console.error(`Upload error for ${file.name}:`, err);
        }

        setUploadedCount(i + 1);
        setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
      }

      if (uploadedUrls.length > 0) {
        onUpload(uploadedUrls);
      }

      setIsUploading(false);
      setUploadProgress(0);
      setTotalToUpload(0);
      setUploadedCount(0);
    },
    [folder, gender, category, productSlug, sku, currentCount, maxImages, remainingSlots, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files);
    }
    // Reset input so same files can be selected again
    e.target.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          isUploading && "pointer-events-none opacity-70",
          remainingSlots === 0 && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
          id="multi-image-upload"
          disabled={isUploading || remainingSlots === 0}
        />
        <label
          htmlFor="multi-image-upload"
          className="cursor-pointer block"
        >
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">
                Yukleniyor... {uploadedCount}/{totalToUpload}
              </p>
              <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{uploadProgress}%</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Images className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">
                  Gorselleri secin
                </span>{" "}
                veya surukleyin
              </p>
              <p className="text-xs text-gray-400">
                Birden fazla gorsel secebilirsiniz (Maks. {maxImages})
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WebP (maks. 5MB)
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {currentCount} / {maxImages} gorsel yuklendi
        </span>
        {remainingSlots === 0 && (
          <span className="text-amber-600">Limit doldu</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <X className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default MultiImageUpload;
