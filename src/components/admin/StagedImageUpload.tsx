"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { X, GripVertical, Images } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

// Staged image - not uploaded yet
export interface StagedImage {
  id: string;
  file: File;
  previewUrl: string; // blob URL
  color?: string;
}

interface SortableImageCardProps {
  image: StagedImage;
  index: number;
  onRemove: () => void;
  onColorChange: (color: string) => void;
  availableColors: string[];
}

function SortableImageCard({
  image,
  index,
  onRemove,
  onColorChange,
  availableColors,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative bg-white border rounded-lg overflow-hidden",
        isDragging && "ring-2 ring-blue-500"
      )}
    >
      {/* Position number */}
      <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {index + 1}
      </div>

      {/* Primary image badge */}
      {index === 0 && (
        <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs px-2 py-0.5 rounded">
          Ana
        </div>
      )}

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-10 cursor-grab active:cursor-grabbing bg-white/80 backdrop-blur rounded p-1 shadow"
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute bottom-12 right-2 z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Image preview */}
      <div className="aspect-square relative">
        <Image
          src={image.previewUrl}
          alt={`Gorsel ${index + 1}`}
          fill
          className="object-cover"
        />
        {/* Pending badge */}
        <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
          Bekliyor
        </div>
      </div>

      {/* Color selection */}
      {availableColors.length > 0 && (
        <div className="p-2 border-t bg-gray-50">
          <select
            value={image.color || ""}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full text-xs px-2 py-1 border rounded"
          >
            <option value="">Tum Renkler</option>
            {availableColors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

interface StagedImageUploadProps {
  stagedImages: StagedImage[];
  onStagedImagesChange: (images: StagedImage[]) => void;
  maxImages?: number;
  availableColors?: string[];
}

export function StagedImageUpload({
  stagedImages,
  onStagedImagesChange,
  maxImages = 10,
  availableColors = [],
}: StagedImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle file selection
  const handleFilesSelected = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const remainingSlots = maxImages - stagedImages.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);

      if (filesToAdd.length === 0) {
        alert(`Maksimum ${maxImages} gorsel ekleyebilirsiniz.`);
        return;
      }

      const newImages: StagedImage[] = filesToAdd
        .filter((file) => file.type.startsWith("image/"))
        .filter((file) => file.size <= 5 * 1024 * 1024) // 5MB limit
        .map((file) => ({
          id: `staged-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          color: "",
        }));

      onStagedImagesChange([...stagedImages, ...newImages]);
    },
    [stagedImages, maxImages, onStagedImagesChange]
  );

  // Remove image
  const handleRemove = useCallback(
    (id: string) => {
      const image = stagedImages.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.previewUrl); // Memory cleanup
      }
      onStagedImagesChange(stagedImages.filter((img) => img.id !== id));
    },
    [stagedImages, onStagedImagesChange]
  );

  // Change color
  const handleColorChange = useCallback(
    (id: string, color: string) => {
      onStagedImagesChange(
        stagedImages.map((img) => (img.id === id ? { ...img, color } : img))
      );
    },
    [stagedImages, onStagedImagesChange]
  );

  // Drag and drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stagedImages.findIndex((img) => img.id === active.id);
      const newIndex = stagedImages.findIndex((img) => img.id === over.id);
      onStagedImagesChange(arrayMove(stagedImages, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <label
        className={cn(
          "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:bg-gray-50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFilesSelected(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            handleFilesSelected(e.target.files);
            e.target.value = ""; // Reset so same files can be selected again
          }}
          className="hidden"
        />
        <Images className="w-8 h-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-medium text-blue-600">Gorselleri secin</span>{" "}
          veya surukleyin
        </p>
        <p className="text-xs text-gray-400">
          Birden fazla secebilirsiniz - Maks. 5MB - {stagedImages.length}/
          {maxImages}
        </p>
      </label>

      {/* Staged Images Grid */}
      {stagedImages.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stagedImages.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stagedImages.map((image, index) => (
                <SortableImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  onRemove={() => handleRemove(image.id)}
                  onColorChange={(color) => handleColorChange(image.id, color)}
                  availableColors={availableColors}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Info */}
      {stagedImages.length > 0 && (
        <p className="text-xs text-amber-600">
          Gorseller henuz yuklenmedi. &quot;Urun Olustur&quot; butonuna
          bastiginizda yuklenecek.
        </p>
      )}
    </div>
  );
}

export default StagedImageUpload;
