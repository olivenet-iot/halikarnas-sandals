"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  subfolder?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "products",
  subfolder,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir görsel dosyası seçin");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalı");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Build folder path with optional subfolder
      const fullFolder = subfolder
        ? `halikarnas/${folder}/${subfolder}`
        : `halikarnas/${folder}`;
      formData.append("folder", fullFolder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.url);
      } else {
        alert("Yükleme başarısız: " + data.error);
      }
    } catch (error) {
      alert("Yükleme sırasında hata oluştu");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [folder, subfolder]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Preview */}
      {value && (
        <div className="relative aspect-video w-full max-w-xs rounded-lg overflow-hidden border bg-gray-50">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            sizes="320px"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200",
            dragActive
              ? "border-luxury-primary bg-luxury-primary/5"
              : "border-gray-300 hover:border-gray-400",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id={`image-upload-${folder}-${subfolder || 'default'}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`image-upload-${folder}-${subfolder || 'default'}`}
            className="cursor-pointer block"
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
            )}
            <p className="mt-2 text-sm text-gray-600">
              {isUploading
                ? "Yükleniyor..."
                : "Görsel yüklemek için tıklayın veya sürükleyin"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, WebP (max 5MB)
            </p>
          </label>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
