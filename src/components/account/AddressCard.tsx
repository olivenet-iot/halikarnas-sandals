"use client";

import { useState } from "react";
import { Home, Building, MapPin, Phone, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string | null;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const { toast } = useToast();

  const Icon = address.title.toLowerCase().includes("ev") ? Home : Building;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/addresses/${address.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      toast({
        title: "Adres silindi",
        description: "Adres başarıyla silindi.",
      });

      onDelete(address.id);
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Adres silinemedi",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      const res = await fetch(`/api/addresses/${address.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, isDefault: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      toast({
        title: "Varsayılan adres güncellendi",
        description: `"${address.title}" varsayılan adres olarak ayarlandı.`,
      });

      onSetDefault(address.id);
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Varsayılan adres ayarlanamadı",
        variant: "destructive",
      });
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-sand-200 p-6 hover:border-aegean-200 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sand-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-leather-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-leather-800">{address.title}</h3>
              {address.isDefault && (
                <Badge variant="secondary" className="bg-aegean-50 text-aegean-700">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Varsayılan
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Info */}
      <div className="space-y-2 text-sm text-leather-600 mb-4">
        <p className="font-medium text-leather-800">
          {address.firstName} {address.lastName}
        </p>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-leather-400" />
          <div>
            <p>{address.address}</p>
            <p>
              {address.district} / {address.city}
            </p>
            {address.postalCode && <p>{address.postalCode}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-leather-400" />
          <p>{address.phone}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(address)}>
          <Pencil className="h-4 w-4 mr-1" />
          Düzenle
        </Button>

        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetDefault}
            disabled={isSettingDefault}
          >
            {isSettingDefault ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Star className="h-4 w-4 mr-1" />
            )}
            Varsayılan Yap
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Sil
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Adresi Sil</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{address.title}&quot; adresini silmek istediğinize emin misiniz?
                Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
