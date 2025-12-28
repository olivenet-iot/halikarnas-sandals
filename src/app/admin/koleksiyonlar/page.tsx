"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  bannerImage: string | null;
  isActive: boolean;
  isFeatured: boolean;
  position: number;
  metaTitle: string | null;
  metaDescription: string | null;
  _count?: { products: number };
}

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

// Collection Image Upload Component
function CollectionImageUpload({
  onUpload,
  inputId = "collection-image-upload",
  folder = "halikarnas/collections",
}: {
  onUpload: (url: string) => void;
  inputId?: string;
  folder?: string;
}) {
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
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (data.success) {
        onUpload(data.url);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors duration-200
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
        ${isUploading ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id={inputId}
        disabled={isUploading}
      />
      <label htmlFor={inputId} className="cursor-pointer block">
        {isUploading ? (
          <Loader2 className="w-6 h-6 mx-auto text-gray-400 animate-spin" />
        ) : (
          <Upload className="w-6 h-6 mx-auto text-gray-400" />
        )}
        <p className="mt-1 text-xs text-gray-600">
          {isUploading ? "Yükleniyor..." : "Görsel yükle"}
        </p>
      </label>
    </div>
  );
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    bannerImage: "",
    isActive: true,
    isFeatured: false,
    position: 0,
    metaTitle: "",
    metaDescription: "",
  });

  const { toast } = useToast();

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/admin/collections");
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections);
      }
    } catch {
      toast({
        title: "Hata",
        description: "Koleksiyonlar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateDialog = () => {
    setEditingCollection(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      bannerImage: "",
      isActive: true,
      isFeatured: false,
      position: 0,
      metaTitle: "",
      metaDescription: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || "",
      image: collection.image || "",
      bannerImage: collection.bannerImage || "",
      isActive: collection.isActive,
      isFeatured: collection.isFeatured,
      position: collection.position,
      metaTitle: collection.metaTitle || "",
      metaDescription: collection.metaDescription || "",
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (collection: Collection) => {
    setDeletingCollection(collection);
    setIsDeleteDialogOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !editingCollection ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingCollection
        ? `/api/admin/collections/${editingCollection.id}`
        : "/api/admin/collections";
      const method = editingCollection ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata oluştu");
      }

      toast({
        title: editingCollection
          ? "Koleksiyon güncellendi"
          : "Koleksiyon oluşturuldu",
        description: editingCollection
          ? "Koleksiyon başarıyla güncellendi."
          : "Yeni koleksiyon başarıyla oluşturuldu.",
      });

      setIsDialogOpen(false);
      fetchCollections();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCollection) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/collections/${deletingCollection.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata oluştu");
      }

      toast({
        title: "Koleksiyon silindi",
        description: "Koleksiyon başarıyla silindi.",
      });

      setIsDeleteDialogOpen(false);
      setDeletingCollection(null);
      fetchCollections();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (collection: Collection) => {
    try {
      const res = await fetch(`/api/admin/collections/${collection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !collection.isActive }),
      });

      if (!res.ok) {
        throw new Error("Bir hata oluştu");
      }

      toast({
        title: collection.isActive ? "Koleksiyon pasif yapıldı" : "Koleksiyon aktif yapıldı",
      });

      fetchCollections();
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Koleksiyonlar</h1>
          <p className="text-gray-500 mt-1">Ürün koleksiyonlarını yönetin</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Koleksiyon
        </Button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          ))
        ) : collections.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Henüz koleksiyon oluşturulmamış
          </div>
        ) : (
          collections.map((collection) => (
            <Card key={collection.id} className={!collection.isActive ? "opacity-60" : ""}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <Badge variant={collection.isActive ? "default" : "secondary"}>
                      {collection.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                    {collection.isFeatured && (
                      <Badge variant="outline" className="border-amber-500 text-amber-600">
                        Öne Çıkan
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">/{collection.slug}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(collection)}
                    title={collection.isActive ? "Pasif yap" : "Aktif yap"}
                  >
                    {collection.isActive ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(collection)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => openDeleteDialog(collection)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {collection.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {collection._count?.products || 0} ürün
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? "Koleksiyonu Düzenle" : "Yeni Koleksiyon"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Koleksiyon Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            {/* Thumbnail Image */}
            <div className="space-y-2">
              <Label>Thumbnail Görseli (Kart için)</Label>
              <p className="text-xs text-gray-500">Koleksiyon kartlarında görünecek kare görsel. Önerilen: 600x800px</p>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, image: e.target.value }))
                  }
                />
                <CollectionImageUpload
                  inputId="thumbnail-upload"
                  folder="halikarnas/collections/thumbnails"
                  onUpload={(url) =>
                    setFormData((prev) => ({ ...prev, image: url }))
                  }
                />
              </div>
              {formData.image && (
                <div className="relative w-24 h-32 rounded-lg overflow-hidden border">
                  <img src={formData.image} alt="Thumbnail önizleme" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Hero Banner Image */}
            <div className="space-y-2">
              <Label>Hero Banner Görseli</Label>
              <p className="text-xs text-gray-500">Koleksiyon detay sayfasında tam genişlik banner. Önerilen: 1920x800px</p>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.bannerImage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bannerImage: e.target.value }))
                  }
                />
                <CollectionImageUpload
                  inputId="banner-upload"
                  folder="halikarnas/collections/banners"
                  onUpload={(url) =>
                    setFormData((prev) => ({ ...prev, bannerImage: url }))
                  }
                />
              </div>
              {formData.bannerImage && (
                <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border">
                  <img src={formData.bannerImage} alt="Banner önizleme" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            {/* Status & Position Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked as boolean }))
                    }
                  />
                  <Label htmlFor="isActive" className="font-normal cursor-pointer">
                    Aktif
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isFeatured: checked as boolean }))
                    }
                  />
                  <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
                    Öne Çıkan
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Sıralama</Label>
                <Input
                  id="position"
                  type="number"
                  min="0"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, position: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm font-medium text-gray-700">SEO Ayarları</p>
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Başlık</Label>
                <Input
                  id="metaTitle"
                  placeholder="Sayfa başlığı (boş bırakılırsa koleksiyon adı kullanılır)"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Açıklama</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Arama motorlarında görünecek açıklama"
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingCollection ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Koleksiyonu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deletingCollection?.name}&quot; koleksiyonunu silmek istediğinize
              emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
