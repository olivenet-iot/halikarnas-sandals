"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ProductGridV2 } from "@/components/shop/ProductGridV2";
import type { ProductCardV2Props } from "@/components/shop/ProductCardV2";

const sortOptions = [
  { value: "relevance", label: "Önerilen" },
  { value: "newest", label: "En Yeni" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "bestseller", label: "Çok Satanlar" },
];

const genderOptions = [
  { value: "", label: "Tümü" },
  { value: "KADIN", label: "Kadın" },
  { value: "ERKEK", label: "Erkek" },
  { value: "UNISEX", label: "Unisex" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [products, setProducts] = useState<ProductCardV2Props[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("relevance");
  const [gender, setGender] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const performSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (sort) params.set("sort", sort);
      if (gender) params.set("gender", gender);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sort, gender, minPrice, maxPrice]);

  useEffect(() => {
    setQuery(queryParam);
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.pushState({}, "", url.toString());
  };

  const applyFilters = () => {
    performSearch(query);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pt-[100px] md:pt-[120px] pb-16">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-v2-text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün ara..."
              className="pl-12 pr-24 h-12 text-lg"
            />
            <Button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
              size="sm"
            >
              Ara
            </Button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      {queryParam && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary">
              &quot;{queryParam}&quot; için arama sonuçları
            </h1>
            <p className="font-inter text-sm text-v2-text-muted mt-1">
              {isLoading ? "Aranıyor..." : `${total} sonuç bulundu`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={sort} onValueChange={(value) => { setSort(value); performSearch(query); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Cinsiyet</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Fiyat Aralığı</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={applyFilters}>
                    Filtreleri Uygula
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-v2-accent" />
        </div>
      ) : products.length > 0 ? (
        <ProductGridV2 products={products} />
      ) : queryParam ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto bg-v2-bg-primary flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-v2-text-muted" />
          </div>
          <h2 className="font-serif font-light text-xl text-v2-text-primary mb-2">
            &quot;{queryParam}&quot; için sonuç bulunamadı
          </h2>
          <p className="font-inter text-sm text-v2-text-muted mb-6">
            Farklı anahtar kelimeler deneyin veya kategorilere göz atın.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/kadin">Kadın Sandaletler</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/erkek">Erkek Sandaletler</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-inter text-sm text-v2-text-muted">
            Aramak istediğiniz ürünü yukarıdaki alana yazın.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pt-[120px]">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-v2-accent" />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
