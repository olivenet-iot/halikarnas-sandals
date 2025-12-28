"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import Papa from "papaparse";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Download,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewRow {
  urun_kodu: string;
  urun_adi: string;
  stok_kodu: string;
  fiyat: string;
  stok: string;
  // Legacy field names for backwards compatibility
  handle?: string;
  title?: string;
  variant_sku?: string;
  variant_price?: string;
  variant_inventory_qty?: string;
}

export default function ProductImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: number;
    failed: number;
    errors?: string[];
  } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0];
    if (csvFile) {
      setFile(csvFile);
      setResult(null);
      setErrors([]);
      parseCSVPreview(csvFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const parseCSVPreview = async (file: File) => {
    const text = await file.text();
    // Remove BOM if present
    const cleanText = text.replace(/^\uFEFF/, "");

    Papa.parse(cleanText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as PreviewRow[];
        setTotalRows(data.length);
        setPreview(data.slice(0, 5));

        // Validate required fields - support both new Turkish and old English field names
        const validationErrors: string[] = [];
        const firstRow = data[0];
        if (!firstRow?.urun_kodu && !firstRow?.handle) {
          validationErrors.push("'urun_kodu' sütunu eksik veya boş");
        }
        if (!firstRow?.urun_adi && !firstRow?.title) {
          validationErrors.push("'urun_adi' sütunu eksik veya boş");
        }
        setErrors(validationErrors);
      },
      error: (error: { message: string }) => {
        setErrors([`CSV parse hatası: ${error.message}`]);
      },
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors([data.error || "İçe aktarma başarısız"]);
      } else {
        setResult(data);
        if (data.errors && data.errors.length > 0) {
          setErrors(data.errors);
        }
      }
    } catch {
      setErrors(["İçe aktarma sırasında bir hata oluştu"]);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    window.location.href = "/api/admin/products/template";
  };

  const clearFile = () => {
    setFile(null);
    setPreview([]);
    setTotalRows(0);
    setErrors([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/urunler">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Toplu Ürün İçe Aktar
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              CSV dosyası ile ürünleri toplu olarak ekleyin veya güncelleyin
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            CSV Şablonu İndir
          </Button>
          <Link href="/api/admin/products/export">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Mevcut Ürünleri Dışa Aktar
            </Button>
          </Link>
        </div>
      </div>

      {/* Dropzone */}
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-aegean-500 bg-aegean-50"
                : "border-gray-300 hover:border-aegean-400 hover:bg-gray-50"
            }`}
        >
          <input {...getInputProps()} />
          <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg text-aegean-600">
              CSV dosyasını buraya bırakın...
            </p>
          ) : (
            <>
              <p className="text-lg mb-2 text-gray-700">
                CSV dosyasını sürükleyip bırakın
              </p>
              <p className="text-sm text-gray-500">
                veya dosya seçmek için tıklayın
              </p>
            </>
          )}
        </div>
      )}

      {/* File Info */}
      {file && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB &bull; {totalRows} satır
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium text-gray-900">
              Önizleme (İlk 5 ürün)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Ürün Kodu
                  </th>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Ürün Adı
                  </th>
                  <th className="p-3 text-left font-medium text-gray-600">
                    Stok Kodu
                  </th>
                  <th className="p-3 text-right font-medium text-gray-600">
                    Fiyat
                  </th>
                  <th className="p-3 text-right font-medium text-gray-600">
                    Stok
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs text-gray-600">
                      {row.urun_kodu || row.handle}
                    </td>
                    <td className="p-3 text-gray-900">{row.urun_adi || row.title}</td>
                    <td className="p-3 font-mono text-xs text-gray-600">
                      {row.stok_kodu || row.variant_sku}
                    </td>
                    <td className="p-3 text-right text-gray-900">
                      ₺{row.fiyat || row.variant_price}
                    </td>
                    <td className="p-3 text-right text-gray-900">
                      {row.stok || row.variant_inventory_qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalRows > 5 && (
            <div className="p-3 bg-gray-50 border-t text-center text-sm text-gray-500">
              ve {totalRows - 5} satır daha...
            </div>
          )}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">
              {result ? "Bazı Hatalar Oluştu" : "Doğrulama Hataları"}
            </span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
            {errors.slice(0, 10).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
            {errors.length > 10 && (
              <li className="text-red-500">
                ve {errors.length - 10} hata daha...
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              İçe aktarma tamamlandı: {result.success} başarılı
              {result.failed > 0 && `, ${result.failed} başarısız`}
            </span>
          </div>
        </div>
      )}

      {/* Import Button */}
      {file && errors.length === 0 && !result && (
        <div className="flex justify-end">
          <Button onClick={handleImport} disabled={importing}>
            {importing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                İçe Aktarılıyor...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {totalRows} Ürünü İçe Aktar
              </>
            )}
          </Button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-3">📋 CSV Dosyası Nasıl Hazırlanır?</h3>
        <div className="text-sm text-blue-700 space-y-3">
          <div>
            <p className="font-medium mb-1">Zorunlu Alanlar:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>urun_kodu:</strong> URL&apos;de görünecek kod (örn: bodrum-classic)</li>
              <li><strong>urun_adi:</strong> Ürün adı</li>
              <li><strong>stok_kodu:</strong> Her varyant için benzersiz kod (örn: BOD-KHV-36)</li>
              <li><strong>fiyat:</strong> Satış fiyatı</li>
            </ul>
          </div>

          <div>
            <p className="font-medium mb-1">Opsiyonel Alanlar:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>indirimli_fiyat:</strong> İndirimden önceki fiyat (üstü çizili gösterilir)</li>
              <li><strong>gorsel_url:</strong> Ürün görseli linki</li>
              <li><strong>kategori:</strong> Ürün kategorisi</li>
              <li><strong>cinsiyet:</strong> Kadın, Erkek veya Unisex</li>
              <li><strong>renk:</strong> Varyant rengi</li>
              <li><strong>beden:</strong> Varyant bedeni</li>
              <li><strong>stok:</strong> Stok miktarı</li>
            </ul>
          </div>

          <div className="bg-blue-100 p-3 rounded">
            <p className="font-medium">💡 İpucu:</p>
            <p>Aynı ürünün farklı renk/beden varyantları için aynı <strong>urun_kodu</strong>&apos;nu kullanın. Her satır bir varyantı temsil eder.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
