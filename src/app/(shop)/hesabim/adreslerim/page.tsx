"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { AddressForm } from "@/components/account/AddressForm";
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

export default function AdreslerimPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { toast } = useToast();

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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast({ title: "Adres silindi" });
      }
    } catch {
      toast({ title: "Hata", description: "Adres silinemedi", variant: "destructive" });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a.id === id }))
        );
      }
    } catch {
      toast({ title: "Hata", variant: "destructive" });
    }
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) setEditingAddress(null);
  };

  const canAddMore = addresses.length < 5;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-v2-text-muted" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between pb-8 border-b border-v2-border-subtle">
        <div>
          <h1 className="font-serif font-light text-3xl md:text-4xl text-v2-text-primary">
            Adreslerim
          </h1>
          <p className="text-v2-text-muted font-inter text-sm mt-2">
            {addresses.length} / 5 adres
          </p>
        </div>
        {canAddMore && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-6 py-2.5 font-inter text-xs tracking-wide uppercase transition-colors rounded-none"
          >
            + Yeni Adres Ekle
          </button>
        )}
      </div>

      {/* Address List */}
      {addresses.length > 0 ? (
        <div className="mt-8">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="py-6 border-b border-v2-border-subtle"
            >
              <div className="flex items-start justify-between">
                <div>
                  {address.isDefault && (
                    <span className="inline-block font-inter text-[10px] uppercase tracking-widest text-v2-accent bg-v2-accent/10 px-2 py-0.5 mb-2">
                      Varsayilan
                    </span>
                  )}
                  <p className="font-inter text-sm font-medium text-v2-text-primary">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="font-inter text-sm text-v2-text-muted mt-1">
                    {address.address}
                  </p>
                  <p className="font-inter text-sm text-v2-text-muted">
                    {address.district} / {address.city}
                  </p>
                  <p className="font-inter text-sm text-v2-text-muted">
                    {address.phone}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors"
                  >
                    Duzenle
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors"
                    >
                      Varsayilan yap
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12">
          <p className="font-inter text-sm text-v2-text-muted">
            Henuz adres eklemediniz.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="font-inter text-sm text-v2-text-primary underline underline-offset-4 hover:text-v2-text-muted transition-colors mt-3 inline-block"
          >
            Ilk adresinizi ekleyin &rarr;
          </button>
        </div>
      )}

      <AddressForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        address={editingAddress}
        onSuccess={fetchAddresses}
      />
    </div>
  );
}
