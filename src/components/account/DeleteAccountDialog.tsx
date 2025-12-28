"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

      // Sign out and redirect
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Hata",
        description:
          error instanceof Error ? error.message : "Bir hata oluştu",
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
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          Hesabımı Kalıcı Olarak Sil
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Hesabı Sil
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak
              silinecektir. Bu işlem şunları içerir:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Tüm sipariş geçmişiniz</li>
              <li>Kayıtlı adresleriniz</li>
              <li>Favorileriniz</li>
              <li>Hesap bilgileriniz</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="delete-password">Şifrenizi Girin</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifreniz"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="delete-confirmation">
              Onaylamak için <strong>DELETE</strong> yazın
            </Label>
            <Input
              id="delete-confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DELETE"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isValid || isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Hesabı Sil
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
