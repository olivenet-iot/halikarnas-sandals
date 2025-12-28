import { NextResponse } from "next/server";

// UTF-8 BOM ekle (Türkçe karakterler için)
const BOM = "\uFEFF";

const CSV_TEMPLATE = `urun_kodu,urun_adi,aciklama,kategori,cinsiyet,renk,beden,stok_kodu,fiyat,indirimli_fiyat,stok,gorsel_url
bodrum-classic,Bodrum Classic,Bodrum'un klasik sandalet tasarimi. Premium hakiki deri.,Sandalet,Kadin,Kahverengi,36,BOD-KHV-36,1499,1899,10,https://images.unsplash.com/photo-1603487742131-4160ec999306
bodrum-classic,Bodrum Classic,Bodrum'un klasik sandalet tasarimi. Premium hakiki deri.,Sandalet,Kadin,Kahverengi,37,BOD-KHV-37,1499,1899,15,
bodrum-classic,Bodrum Classic,Bodrum'un klasik sandalet tasarimi. Premium hakiki deri.,Sandalet,Kadin,Kahverengi,38,BOD-KHV-38,1499,1899,20,
bodrum-classic,Bodrum Classic,Bodrum'un klasik sandalet tasarimi. Premium hakiki deri.,Sandalet,Kadin,Bej,36,BOD-BEJ-36,1499,1899,12,https://images.unsplash.com/photo-1595341888016-a392ef81b7de
ege-terlik,Ege Terlik,Yaz sezonunun vazgecilmez modeli.,Terlik,Kadin,Siyah,37,EGE-SYH-37,1299,,25,https://images.unsplash.com/photo-1543163521-1bf539c55dd2`;

export async function GET() {
  return new NextResponse(BOM + CSV_TEMPLATE, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=urun-sablonu.csv",
    },
  });
}
