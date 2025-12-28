"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressCard } from "@/components/account/AddressCard";
import { AddressForm } from "@/components/account/AddressForm";

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

export default function AdreslerimPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingAddress(null);
    }
  };

  const handleFormSuccess = () => {
    fetchAddresses();
  };

  const canAddMore = addresses.length < 5;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-aegean-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-accent font-semibold text-leather-800">
            Adreslerim
          </h1>
          <p className="text-leather-500 mt-1">
            {addresses.length} / 5 adres kayıtlı
          </p>
        </div>
        {canAddMore && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Adres Ekle
          </Button>
        )}
      </div>

      {addresses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-leather-400" />
          </div>
          <h2 className="text-lg font-semibold text-leather-800 mb-2">
            Henüz adres eklemediniz
          </h2>
          <p className="text-leather-500 mb-6">
            Siparişlerinizi daha hızlı tamamlamak için adres ekleyin.
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            İlk Adresinizi Ekleyin
          </Button>
        </div>
      )}

      <AddressForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        address={editingAddress}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
