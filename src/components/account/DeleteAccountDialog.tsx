"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteAccountDialogProps {
  hasPassword: boolean;
}

export function DeleteAccountDialog({ hasPassword }: DeleteAccountDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const { toast } = useToast();

  const isValid = confirmation === "DELETE" && (!hasPassword || password.length > 0);

  const handleDelete = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Bir hata oluştu");
      }

      toast({
        title: "Hesap silindi",
        description: "Hesabınız kalıcı olarak silindi.",
      });

      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setPassword("");
      setConfirmation("");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <button className="font-inter text-xs text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors">
          Hesabımı kalıcı olarak sil
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-v2-bg-primary border border-v2-border-subtle rounded-none max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif font-light text-xl text-v2-text-primary">
            Hesabı Sil
          </AlertDialogTitle>
          <AlertDialogDescription className="font-inter text-sm text-v2-text-muted">
            Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            Tüm sipariş geçmişiniz, adresleriniz ve favorileriniz kalıcı olarak silinecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-5 py-4">
          {hasPassword && (
            <div>
              <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
                ŞİFRENİZ
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle text-v2-text-primary text-sm outline-none focus:border-v2-text-primary transition-colors duration-200"
              />
            </div>
          )}

          <div>
            <label className="font-inter text-xs uppercase tracking-[0.15em] text-v2-text-muted mb-2 block">
              ONAY — <span className="text-v2-text-primary">DELETE</span> YAZIN
            </label>
            <input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full px-0 pb-2 bg-transparent border-0 border-b border-v2-border-subtle text-v2-text-primary text-sm outline-none focus:border-v2-text-primary transition-colors duration-200"
            />
          </div>
        </div>

        <AlertDialogFooter className="flex items-center gap-6">
          <AlertDialogCancel className="border-0 bg-transparent font-inter text-sm text-v2-text-muted hover:text-v2-text-primary underline underline-offset-4 transition-colors p-0 h-auto">
            İptal
          </AlertDialogCancel>
          <button
            onClick={handleDelete}
            disabled={!isValid || isLoading}
            className="border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white px-6 py-2.5 font-inter text-xs tracking-wide uppercase transition-colors rounded-none disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />}
            Hesabı Sil
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
