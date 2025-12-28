"use client";

import Image from "next/image";
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
import { X, GripVertical } from "lucide-react";

interface ImageItem {
  id: string;
  url: string;
  alt?: string;
  color?: string | null;
  position?: number;
}

interface ColorOption {
  name: string;
  hex: string;
}

interface SortableImageProps {
  image: ImageItem;
  index: number;
  onRemove: () => void;
  onColorChange: (color: string | null) => void;
  availableColors: ColorOption[];
}

function SortableImage({
  image,
  index,
  onRemove,
  onColorChange,
  availableColors,
}: SortableImageProps) {
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
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white border rounded-lg overflow-hidden ${
        isDragging ? "ring-2 ring-amber-500 shadow-lg" : ""
      }`}
    >
      {/* Position Badge - Top Right */}
      <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
        {index + 1}
      </div>

      {/* Primary Badge - Top Left */}
      {index === 0 && (
        <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
          Ana
        </div>
      )}

      {/* Color Badge - Bottom Left */}
      {image.color && (
        <span className="absolute bottom-2 left-2 z-10 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full border border-white/50"
            style={{
              backgroundColor:
                availableColors.find((c) => c.name === image.color)?.hex ||
                "#888",
            }}
          />
          {image.color}
        </span>
      )}

      {/* Drag Handle - Top Center */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-10 cursor-grab active:cursor-grabbing bg-white/90 backdrop-blur rounded p-1 shadow hover:bg-white transition-colors"
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>

      {/* Delete Button - Bottom Right */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute bottom-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow transition-colors"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Image */}
      <div className="aspect-square relative">
        <Image
          src={image.url}
          alt={image.alt || `Ürün görseli ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* Color Selection */}
      <div className="p-2 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Renk:</span>
          <select
            value={image.color || ""}
            onChange={(e) => onColorChange(e.target.value || null)}
            className="text-xs border rounded px-2 py-1 bg-white max-w-[100px]"
          >
            <option value="">Tümü</option>
            {availableColors.map((color) => (
              <option key={color.name} value={color.name}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

interface SortableImageGridProps {
  images: ImageItem[];
  onReorder: (images: ImageItem[]) => void;
  onRemove: (index: number) => void;
  onColorChange: (index: number, color: string | null) => void;
  availableColors: ColorOption[];
}

export function SortableImageGrid({
  images,
  onReorder,
  onRemove,
  onColorChange,
  availableColors,
}: SortableImageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const reordered = arrayMove(images, oldIndex, newIndex).map(
        (img, idx) => ({
          ...img,
          position: idx,
        })
      );

      onReorder(reordered);
    }
  };

  if (images.length === 0) {
    return (
      <div className="col-span-full py-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
        Henüz görsel eklenmedi
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <SortableImage
                key={image.id}
                image={image}
                index={index}
                onRemove={() => onRemove(index)}
                onColorChange={(color) => onColorChange(index, color)}
                availableColors={availableColors}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <p className="text-xs text-gray-500 mt-4">
        Görselleri sürükleyerek sıralayabilirsiniz. İlk görsel ana ürün görseli
        olarak kullanılır.
      </p>
    </>
  );
}

export default SortableImageGrid;
