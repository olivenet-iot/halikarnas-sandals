"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SortableImageGrid } from "./SortableImageGrid";
import { StagedImageUpload, StagedImage } from "./StagedImageUpload";
import { VariantMatrix, Variant } from "./VariantMatrix";
import { uploadStagedImages, cleanupStagedImages } from "@/lib/uploadImages";

// Schema matching Prisma model
const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, "Beden gerekli"),
  color: z.string().optional(),
  colorHex: z.string().optional(),
  stock: z.number().min(0, "Stok 0'dan küçük olamaz"),
  sku: z.string().min(1, "SKU gerekli"),
});

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url("Geçerli bir URL girin"),
  alt: z.string().optional(),
  color: z.string().optional().nullable(),
  position: z.number().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli"),
  slug: z.string().min(1, "Slug gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  basePrice: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  compareAtPrice: z.number().nullable(),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  gender: z.enum(["KADIN", "ERKEK", "UNISEX"]),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  material: z.string().optional(),
  heelHeight: z.string().optional(),
  soleType: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  collectionIds: z.array(z.string()).optional(),
  variants: z.array(variantSchema).min(1, "En az bir varyant gerekli"),
  images: z.array(imageSchema),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
  gender: "KADIN" | "ERKEK" | "UNISEX" | null;
  slug: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  product?: ProductFormData & { id: string };
  categories: Category[];
  collections?: Collection[];
}

const SIZES = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
const COLORS = [
  { name: "Siyah", hex: "#000000" },
  { name: "Kahverengi", hex: "#8B4513" },
  { name: "Bej", hex: "#F5F5DC" },
  { name: "Ten", hex: "#D2B48C" },
  { name: "Beyaz", hex: "#FFFFFF" },
  { name: "Bordo", hex: "#800020" },
  { name: "Lacivert", hex: "#000080" },
];

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Generate unique SKU
function generateSKU(name: string, size: string, color?: string): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
  const colorCode = color ? color.substring(0, 2).toUpperCase() : "XX";
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${size}-${colorCode}-${random}`;
}

export function ProductForm({ product, categories, collections = [] }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [variantMode, setVariantMode] = useState<"manual" | "matrix">("manual");
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      slug: "",
      description: "",
      shortDescription: "",
      sku: "",
      basePrice: 0,
      compareAtPrice: null,
      categoryId: "",
      gender: undefined,
      status: "DRAFT",
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      material: "Hakiki Deri",
      heelHeight: "",
      soleType: "",
      metaTitle: "",
      metaDescription: "",
      collectionIds: [],
      variants: [{ size: "38", color: "Siyah", colorHex: "#000000", stock: 10, sku: "" }],
      images: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
    replace: replaceVariants,
  } = useFieldArray({ control, name: "variants" });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
    replace: replaceImages,
  } = useFieldArray({ control, name: "images" });

  const [newImageUrl, setNewImageUrl] = useState("");

  // Watch gender for category filtering
  const selectedGender = watch("gender");

  // Filter categories based on selected gender
  const filteredCategories = useMemo(() => {
    if (!selectedGender) return categories;
    return categories.filter(
      (cat) => !cat.gender || cat.gender === selectedGender || cat.gender === "UNISEX"
    );
  }, [categories, selectedGender]);

  // Reset category if it becomes incompatible with selected gender
  useEffect(() => {
    const currentCategoryId = watch("categoryId");
    if (!currentCategoryId || !selectedGender) return;

    const currentCategory = categories.find((c) => c.id === currentCategoryId);
    if (
      currentCategory &&
      currentCategory.gender &&
      currentCategory.gender !== selectedGender &&
      currentCategory.gender !== "UNISEX"
    ) {
      setValue("categoryId", "");
    }
  }, [selectedGender, categories, watch, setValue]);

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!isEditing) {
      setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    // Generate SKUs for variants that don't have one
    data.variants = data.variants.map((v) => ({
      ...v,
      sku: v.sku || generateSKU(data.name, v.size, v.color),
    }));

    setIsLoading(true);

    try {
      // STEP 1: Upload staged images if any
      let uploadedImages: { url: string; color?: string; position: number }[] = [];

      if (stagedImages.length > 0) {
        // Validate required fields for proper folder structure
        if (!data.gender) {
          throw new Error("Gorselleri yuklemek icin cinsiyet secimi zorunludur.");
        }

        const selectedCategory = categories.find((c) => c.id === data.categoryId);
        if (!selectedCategory) {
          throw new Error("Gorselleri yuklemek icin kategori secimi zorunludur.");
        }

        if (!data.sku) {
          throw new Error("Gorselleri yuklemek icin Ana SKU zorunludur.");
        }

        setUploadProgress({ current: 0, total: stagedImages.length });

        uploadedImages = await uploadStagedImages(
          stagedImages,
          {
            gender: data.gender.toLowerCase(),
            categorySlug: selectedCategory.slug,
            productSlug: data.slug || generateSlug(data.name),
            sku: data.sku,
          },
          (current, total) => setUploadProgress({ current, total })
        );

        console.log("✅ Gorseller yuklendi:", uploadedImages.length);
      }

      // STEP 2: Combine existing images with newly uploaded ones
      const existingImageCount = data.images.length;
      const allImages = [
        ...data.images.map((img, idx) => ({
          ...img,
          position: idx,
        })),
        ...uploadedImages.map((img, idx) => ({
          url: img.url,
          alt: "",
          color: img.color || null,
          position: existingImageCount + idx,
        })),
      ];

      // STEP 3: Submit product data
      const productData = {
        ...data,
        images: allImages,
      };

      const url = isEditing
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata olustu");
      }

      // Success - cleanup blob URLs
      cleanupStagedImages(stagedImages);
      setStagedImages([]);

      toast({
        title: isEditing ? "Urun guncellendi" : "Urun olusturuldu",
        description: isEditing
          ? "Urun basariyla guncellendi."
          : "Yeni urun basariyla olusturuldu.",
      });

      router.push("/admin/urunler");
      router.refresh();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata olustu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const addImage = () => {
    if (newImageUrl && newImageUrl.startsWith("http")) {
      appendImage({ url: newImageUrl, alt: "", position: imageFields.length });
      setNewImageUrl("");
    }
  };

  const addVariant = () => {
    const name = watch("name") || "PROD";
    appendVariant({
      size: "38",
      color: "Siyah",
      colorHex: "#000000",
      stock: 10,
      sku: generateSKU(name, "38", "Siyah"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ürün Adı *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    onChange={handleNameChange}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" {...register("slug")} />
                  {errors.slug && (
                    <p className="text-sm text-red-600">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Kısa Açıklama</Label>
                <Input id="shortDescription" {...register("shortDescription")} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">Ana SKU</Label>
                  <Input id="sku" {...register("sku")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Fiyat (₺) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    step="0.01"
                    {...register("basePrice", { valueAsNumber: true })}
                  />
                  {errors.basePrice && (
                    <p className="text-sm text-red-600">{errors.basePrice.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Karşılaştırma Fiyatı (₺)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    {...register("compareAtPrice", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Ürün Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Malzeme</Label>
                  <Input id="material" {...register("material")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heelHeight">Topuk Yüksekliği</Label>
                  <Input id="heelHeight" placeholder="örn: 3cm" {...register("heelHeight")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soleType">Taban Tipi</Label>
                  <Input id="soleType" placeholder="örn: Kauçuk" {...register("soleType")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gorseller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Already uploaded images (for editing) */}
              {imageFields.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Mevcut Gorseller</Label>
                  <SortableImageGrid
                    images={imageFields.map((field, index) => ({
                      id: field.id,
                      url: watch(`images.${index}.url`) || field.url,
                      alt: watch(`images.${index}.alt`) || field.alt,
                      color: watch(`images.${index}.color`) || field.color,
                      position: index,
                    }))}
                    onReorder={(reorderedImages) => {
                      const currentImages = imageFields.map((_, idx) => ({
                        url: watch(`images.${idx}.url`),
                        alt: watch(`images.${idx}.alt`) || "",
                        color: watch(`images.${idx}.color`) || null,
                        position: idx,
                      }));

                      const newImages = reorderedImages.map((img, newIdx) => {
                        const oldIdx = imageFields.findIndex((f) => f.id === img.id);
                        return {
                          ...currentImages[oldIdx],
                          position: newIdx,
                        };
                      });

                      replaceImages(newImages);
                    }}
                    onRemove={(index) => removeImage(index)}
                    onColorChange={(index, color) => {
                      setValue(`images.${index}.color`, color);
                    }}
                    availableColors={COLORS}
                  />
                </div>
              )}

              {/* Staged Image Upload - images wait until submit */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  {imageFields.length > 0 ? "Yeni Gorseller Ekle" : "Gorsel Yukle"}
                </Label>
                <StagedImageUpload
                  stagedImages={stagedImages}
                  onStagedImagesChange={setStagedImages}
                  maxImages={10 - imageFields.length}
                  availableColors={variantFields
                    .map((v) => watch(`variants.${variantFields.indexOf(v)}.color`))
                    .filter((c): c is string => !!c)
                    .filter((v, i, a) => a.indexOf(v) === i)}
                />
              </div>

              {/* Warning if missing required fields */}
              {stagedImages.length > 0 && (!selectedGender || !watch("categoryId") || !watch("sku")) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Gorsellerin dogru klasore yuklenmesi icin lutfen:
                  </p>
                  <ul className="text-sm text-amber-600 list-disc list-inside mt-1">
                    {!selectedGender && <li>Cinsiyet secin</li>}
                    {!watch("categoryId") && <li>Kategori secin</li>}
                    {!watch("sku") && <li>Ana SKU girin</li>}
                  </ul>
                </div>
              )}

              {/* OR - URL Input */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">veya URL ile ekle</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Gorsel URL si girin..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button type="button" variant="outline" onClick={addImage}>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Ekle
                </Button>
              </div>

              {/* Summary */}
              <div className="text-sm text-gray-500">
                Toplam: {imageFields.length} mevcut + {stagedImages.length} yeni = {imageFields.length + stagedImages.length} gorsel
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Varyantlar</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={variantMode === "matrix" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVariantMode("matrix")}
                >
                  Matris ile Olustur
                </Button>
                <Button
                  type="button"
                  variant={variantMode === "manual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVariantMode("manual")}
                >
                  Manuel Ekle
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Matrix Mode */}
                {variantMode === "matrix" && (
                  <VariantMatrix
                    baseSku={watch("sku") || ""}
                    onGenerate={(newVariants: Variant[]) => {
                      // Replace all existing variants with generated ones
                      const formattedVariants = newVariants.map((v) => ({
                        size: v.size,
                        color: v.color,
                        colorHex: v.colorHex,
                        stock: v.stock,
                        sku: v.sku,
                      }));

                      // Use replace instead of loop - prevents infinite loop
                      replaceVariants(formattedVariants);

                      toast({
                        title: "Varyantlar olusturuldu",
                        description: `${formattedVariants.length} varyant basariyla olusturuldu.`,
                      });

                      // Switch to manual mode to show the variants
                      setVariantMode("manual");
                    }}
                  />
                )}

                {/* Manual Mode - Variant List */}
                {variantMode === "manual" && (
                  <>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVariant}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Varyant Ekle
                      </Button>
                    </div>

                    {variantFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50"
                      >
                        <GripVertical className="h-5 w-5 text-gray-400 mt-2 cursor-move" />
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="space-y-1">
                            <Label>Beden</Label>
                            <Select
                              value={watch(`variants.${index}.size`)}
                              onValueChange={(v) => setValue(`variants.${index}.size`, v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SIZES.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label>Renk</Label>
                            <Select
                              value={watch(`variants.${index}.color`) || ""}
                              onValueChange={(v) => {
                                const color = COLORS.find((c) => c.name === v);
                                setValue(`variants.${index}.color`, v);
                                setValue(`variants.${index}.colorHex`, color?.hex || "");
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {COLORS.map((color) => (
                                  <SelectItem key={color.name} value={color.name}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-4 w-4 rounded-full border"
                                        style={{ backgroundColor: color.hex }}
                                      />
                                      {color.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label>Stok</Label>
                            <Input
                              type="number"
                              min="0"
                              {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>SKU *</Label>
                            <Input
                              {...register(`variants.${index}.sku`)}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeVariant(index)}
                              disabled={variantFields.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {errors.variants && (
                  <p className="text-sm text-red-600">{errors.variants.message}</p>
                )}

                {/* Variant count summary */}
                <div className="text-sm text-gray-500 text-right">
                  Toplam {variantFields.length} varyant
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Başlık</Label>
                <Input
                  id="metaTitle"
                  placeholder="Boş bırakılırsa ürün adı kullanılır"
                  {...register("metaTitle")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Açıklama</Label>
                <Textarea
                  id="metaDescription"
                  rows={2}
                  placeholder="Boş bırakılırsa ürün açıklaması kullanılır"
                  {...register("metaDescription")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Durum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Yayın Durumu</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(v) =>
                    setValue("status", v as "DRAFT" | "ACTIVE" | "ARCHIVED")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Taslak</SelectItem>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="ARCHIVED">Arşivlenmiş</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={watch("isFeatured")}
                  onCheckedChange={(checked) =>
                    setValue("isFeatured", checked as boolean)
                  }
                />
                <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
                  Öne Çıkan Ürün
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isNew"
                  checked={watch("isNew")}
                  onCheckedChange={(checked) =>
                    setValue("isNew", checked as boolean)
                  }
                />
                <Label htmlFor="isNew" className="font-normal cursor-pointer">
                  Yeni Ürün
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isBestSeller"
                  checked={watch("isBestSeller")}
                  onCheckedChange={(checked) =>
                    setValue("isBestSeller", checked as boolean)
                  }
                />
                <Label htmlFor="isBestSeller" className="font-normal cursor-pointer">
                  Çok Satan
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organizasyon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 1. Gender (Required - First) */}
              <div className="space-y-2">
                <Label>
                  Cinsiyet <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("gender") || ""}
                  onValueChange={(v) =>
                    setValue("gender", v as "KADIN" | "ERKEK" | "UNISEX")
                  }
                >
                  <SelectTrigger className={!selectedGender ? "border-amber-400" : ""}>
                    <SelectValue placeholder="Cinsiyet secin..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KADIN">Kadin</SelectItem>
                    <SelectItem value="ERKEK">Erkek</SelectItem>
                    <SelectItem value="UNISEX">Unisex</SelectItem>
                  </SelectContent>
                </Select>
                {!selectedGender && (
                  <p className="text-sm text-amber-600">
                    Lutfen once cinsiyet secin
                  </p>
                )}
              </div>

              {/* 2. Category (Required - Depends on Gender) */}
              <div className="space-y-2">
                <Label>
                  Kategori <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("categoryId")}
                  onValueChange={(v) => setValue("categoryId", v)}
                  disabled={!selectedGender}
                >
                  <SelectTrigger className={!selectedGender ? "bg-gray-100 cursor-not-allowed" : ""}>
                    <SelectValue
                      placeholder={
                        selectedGender
                          ? "Kategori secin..."
                          : "Once cinsiyet secin"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                )}
                {selectedGender && filteredCategories.length === 0 && (
                  <p className="text-sm text-amber-600">
                    Bu cinsiyet icin tanimli kategori yok
                  </p>
                )}
              </div>

              {/* Collections */}
              {collections.length > 0 && (
                <div className="space-y-2">
                  <Label>Koleksiyonlar</Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                    {collections.map((collection) => {
                      const isChecked = watch("collectionIds")?.includes(collection.id) ?? false;
                      return (
                        <div key={collection.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`collection-${collection.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const current = watch("collectionIds") || [];
                              if (checked) {
                                setValue("collectionIds", [...current, collection.id]);
                              } else {
                                setValue(
                                  "collectionIds",
                                  current.filter((id) => id !== collection.id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`collection-${collection.id}`}
                            className="font-normal cursor-pointer text-sm"
                          >
                            {collection.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500">
                    Ürünün dahil olacağı koleksiyonları seçin
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isLoading
                  ? uploadProgress.total > 0
                    ? `Görseller yükleniyor... ${uploadProgress.current}/${uploadProgress.total}`
                    : "Kaydediliyor..."
                  : isEditing
                    ? "Güncelle"
                    : "Ürünü Oluştur"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
              >
                İptal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
