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
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductCardProps } from "@/components/shop/ProductCard";

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
  const [products, setProducts] = useState<ProductCardProps[]>([]);
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
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.pushState({}, "", url.toString());
  };

  const applyFilters = () => {
    performSearch(query);
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-leather-400" />
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
            <h1 className="text-2xl font-bold text-leather-900">
              &quot;{queryParam}&quot; için arama sonuçları
            </h1>
            <p className="text-leather-600 mt-1">
              {isLoading ? "Aranıyor..." : `${total} sonuç bulundu`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
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

            {/* Filter Sheet */}
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
          <Loader2 className="h-8 w-8 animate-spin text-aegean-600" />
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : queryParam ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto rounded-full bg-sand-100 flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-sand-400" />
          </div>
          <h2 className="text-xl font-semibold text-leather-900 mb-2">
            &quot;{queryParam}&quot; için sonuç bulunamadı
          </h2>
          <p className="text-leather-600 mb-6">
            Farklı anahtar kelimeler deneyin veya kategorilere göz atın.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/kadin">Kadın Sandaletler</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/erkek">Erkek Sandaletler</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/koleksiyonlar">Koleksiyonlar</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-leather-600">
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
        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-aegean-600" />
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
