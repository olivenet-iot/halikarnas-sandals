"use client";

import { useEffect, useState } from "react";
import { Store, Truck, CreditCard, Share2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface SettingsData {
  // General
  site_name: string;
  site_description: string;
  site_logo: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;

  // Social Media
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;

  // E-commerce
  free_shipping_threshold: string;
  shipping_cost: string;
  tax_rate: string;
  currency: string;
  low_stock_threshold: string;

  // Payment
  payment_iyzico_enabled: string;
  payment_iyzico_api_key: string;
  payment_iyzico_secret_key: string;
  payment_bank_transfer_enabled: string;
  payment_bank_iban: string;
  payment_bank_name: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  site_name: "Halikarnas Sandals",
  site_description: "El yapımı deri sandalet",
  site_logo: "",
  contact_email: "info@halikarnassandals.com",
  contact_phone: "+90 555 123 4567",
  contact_address: "Bodrum, Muğla, Türkiye",

  social_facebook: "",
  social_instagram: "",
  social_twitter: "",
  social_youtube: "",

  free_shipping_threshold: "500",
  shipping_cost: "29.90",
  tax_rate: "20",
  currency: "TRY",
  low_stock_threshold: "5",

  payment_iyzico_enabled: "false",
  payment_iyzico_api_key: "",
  payment_iyzico_secret_key: "",
  payment_bank_transfer_enabled: "true",
  payment_bank_iban: "",
  payment_bank_name: "",
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Ayarlar yüklenemedi");
      const data = await res.json();

      // Merge fetched settings with defaults
      const mergedSettings = { ...DEFAULT_SETTINGS };
      data.settings.forEach((setting: { key: string; value: string }) => {
        if (setting.key in mergedSettings) {
          (mergedSettings as Record<string, string>)[setting.key] = setting.value;
        }
      });

      setSettings(mergedSettings);
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (group?: string) => {
    setIsSaving(true);
    try {
      const settingsToSave = Object.entries(settings)
        .filter(([key]) => {
          if (!group) return true;
          if (group === "general") return key.startsWith("site_") || key.startsWith("contact_");
          if (group === "social") return key.startsWith("social_");
          if (group === "ecommerce") return ["free_shipping_threshold", "shipping_cost", "tax_rate", "currency", "low_stock_threshold"].includes(key);
          if (group === "payment") return key.startsWith("payment_");
          return false;
        })
        .map(([key, value]) => ({
          key,
          value,
          group: key.startsWith("social_") ? "social" :
                 key.startsWith("payment_") ? "payment" :
                 key.startsWith("site_") || key.startsWith("contact_") ? "general" : "ecommerce",
        }));

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (!res.ok) throw new Error("Ayarlar kaydedilemedi");

      toast({ title: "Ayarlar kaydedildi" });
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
        <p className="text-gray-500 mt-1">
          Genel site ayarları, ödeme ve kargo yapılandırması
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Genel</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Sosyal Medya</span>
          </TabsTrigger>
          <TabsTrigger value="ecommerce" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">E-Ticaret</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Ödeme</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Bilgileri</CardTitle>
              <CardDescription>
                Temel site bilgileri ve iletişim ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site Adı</Label>
                  <Input
                    value={settings.site_name}
                    onChange={(e) => updateSetting("site_name", e.target.value)}
                    placeholder="Halikarnas Sandals"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input
                    value={settings.site_logo}
                    onChange={(e) => updateSetting("site_logo", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Site Açıklaması</Label>
                <Textarea
                  value={settings.site_description}
                  onChange={(e) => updateSetting("site_description", e.target.value)}
                  placeholder="Site hakkında kısa açıklama..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>İletişim Email</Label>
                  <Input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => updateSetting("contact_email", e.target.value)}
                    placeholder="info@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>İletişim Telefon</Label>
                  <Input
                    value={settings.contact_phone}
                    onChange={(e) => updateSetting("contact_phone", e.target.value)}
                    placeholder="+90 555 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adres</Label>
                <Textarea
                  value={settings.contact_address}
                  onChange={(e) => updateSetting("contact_address", e.target.value)}
                  placeholder="Mağaza adresi..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => saveSettings("general")} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Bağlantıları</CardTitle>
              <CardDescription>
                Site footer ve header&apos;da gösterilecek sosyal medya hesapları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={settings.social_facebook}
                    onChange={(e) => updateSetting("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={settings.social_instagram}
                    onChange={(e) => updateSetting("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Twitter / X</Label>
                  <Input
                    value={settings.social_twitter}
                    onChange={(e) => updateSetting("social_twitter", e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube</Label>
                  <Input
                    value={settings.social_youtube}
                    onChange={(e) => updateSetting("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => saveSettings("social")} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </TabsContent>

        {/* E-commerce Settings */}
        <TabsContent value="ecommerce" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kargo Ayarları</CardTitle>
              <CardDescription>
                Kargo ücretleri ve ücretsiz kargo limitleri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kargo Ücreti (TL)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.shipping_cost}
                    onChange={(e) => updateSetting("shipping_cost", e.target.value)}
                    placeholder="29.90"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ücretsiz Kargo Limiti (TL)</Label>
                  <Input
                    type="number"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => updateSetting("free_shipping_threshold", e.target.value)}
                    placeholder="500"
                  />
                  <p className="text-xs text-gray-500">
                    Bu tutarın üzerinde kargo ücretsiz
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vergi & Stok Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>KDV Oranı (%)</Label>
                  <Input
                    type="number"
                    value={settings.tax_rate}
                    onChange={(e) => updateSetting("tax_rate", e.target.value)}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Para Birimi</Label>
                  <Input
                    value={settings.currency}
                    onChange={(e) => updateSetting("currency", e.target.value)}
                    placeholder="TRY"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Düşük Stok Uyarısı</Label>
                  <Input
                    type="number"
                    value={settings.low_stock_threshold}
                    onChange={(e) => updateSetting("low_stock_threshold", e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => saveSettings("ecommerce")} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banka Havalesi / EFT</CardTitle>
              <CardDescription>
                Havale ile ödeme için banka hesap bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Havale ile Ödeme</p>
                  <p className="text-sm text-gray-500">
                    Müşteriler havale ile ödeme yapabilsin
                  </p>
                </div>
                <Switch
                  checked={settings.payment_bank_transfer_enabled === "true"}
                  onCheckedChange={(checked) =>
                    updateSetting("payment_bank_transfer_enabled", checked ? "true" : "false")
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Banka Adı</Label>
                  <Input
                    value={settings.payment_bank_name}
                    onChange={(e) => updateSetting("payment_bank_name", e.target.value)}
                    placeholder="Ziraat Bankası"
                  />
                </div>
                <div className="space-y-2">
                  <Label>IBAN</Label>
                  <Input
                    value={settings.payment_bank_iban}
                    onChange={(e) => updateSetting("payment_bank_iban", e.target.value)}
                    placeholder="TR..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>iyzico Entegrasyonu</CardTitle>
              <CardDescription>
                Kredi kartı ile online ödeme için iyzico API ayarları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">iyzico ile Ödeme</p>
                  <p className="text-sm text-gray-500">
                    Kredi kartı ile ödeme aktif olsun
                  </p>
                </div>
                <Switch
                  checked={settings.payment_iyzico_enabled === "true"}
                  onCheckedChange={(checked) =>
                    updateSetting("payment_iyzico_enabled", checked ? "true" : "false")
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={settings.payment_iyzico_api_key}
                    onChange={(e) => updateSetting("payment_iyzico_api_key", e.target.value)}
                    placeholder="iyzico API Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input
                    type="password"
                    value={settings.payment_iyzico_secret_key}
                    onChange={(e) => updateSetting("payment_iyzico_secret_key", e.target.value)}
                    placeholder="iyzico Secret Key"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => saveSettings("payment")} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
