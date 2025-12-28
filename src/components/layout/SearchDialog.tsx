"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/stores/ui-store";
import { formatPrice, getProductUrl } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  categorySlug: string | null;
  price: number;
  compareAtPrice?: number;
  image?: string;
  category: string;
}

// Popular search terms
const popularSearches = [
  "Sandalet",
  "Deri",
  "Yaz",
  "Rahat",
  "Kadın",
  "Erkek",
];

export function SearchDialog() {
  const router = useRouter();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual API call
      // const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      // const data = await response.json();
      // setResults(data.products);

      // Simulated results for now
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockResults: SearchResult[] = [
        {
          id: "1",
          name: "Aegean Sandalet",
          slug: "aegean-sandalet",
          sku: "AE-001",
          gender: "KADIN",
          categorySlug: "bodrum-sandalet",
          price: 1299,
          category: "Kadın Sandalet",
        },
        {
          id: "2",
          name: "Bodrum Classic",
          slug: "bodrum-classic",
          sku: "BC-001",
          gender: "KADIN",
          categorySlug: "bodrum-sandalet",
          price: 1499,
          compareAtPrice: 1799,
          category: "Kadın Sandalet",
        },
        {
          id: "3",
          name: "Halikarnas Erkek",
          slug: "halikarnas-erkek",
          sku: "HE-001",
          gender: "ERKEK",
          categorySlug: "bodrum-sandalet",
          price: 1399,
          category: "Erkek Sandalet",
        },
      ];
      setResults(
        mockResults.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search effect with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  // Clear on close
  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/arama?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const handleResultClick = () => {
    closeSearch();
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={closeSearch}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 border-b border-sand-200">
          <DialogTitle className="sr-only">Ürün Ara</DialogTitle>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-leather-400" />
            <Input
              type="search"
              placeholder="Ürün ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-body-lg border-sand-200 focus:border-aegean-500"
              autoFocus
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-4">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-aegean-500" />
              </div>
            )}

            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <div className="space-y-2">
                <p className="text-body-xs text-leather-500 uppercase tracking-wider mb-3">
                  Arama Sonuçları
                </p>
                <AnimatePresence>
                  {results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={getProductUrl({
                          sku: result.sku,
                          gender: result.gender,
                          category: result.categorySlug ? { slug: result.categorySlug } : null,
                        })}
                        onClick={handleResultClick}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-sand-50 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-sand-100 flex-shrink-0">
                          {result.image ? (
                            <Image
                              src={result.image}
                              alt={result.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-sand-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-md font-medium text-leather-800 truncate">
                            {result.name}
                          </p>
                          <p className="text-body-sm text-leather-500">
                            {result.category}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-body-md font-semibold text-leather-800">
                              {formatPrice(result.price)}
                            </span>
                            {result.compareAtPrice && result.compareAtPrice > result.price && (
                              <span className="text-body-sm text-leather-400 line-through">
                                {formatPrice(result.compareAtPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-leather-400" />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* View All Results Link */}
                {query.trim() && (
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full mt-4 text-aegean-600 hover:text-aegean-700"
                    onClick={handleResultClick}
                  >
                    <Link href={`/arama?q=${encodeURIComponent(query.trim())}`}>
                      Tüm sonuçları gör
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-leather-600 mb-2">
                  &quot;{query}&quot; için sonuç bulunamadı
                </p>
                <p className="text-body-sm text-leather-500">
                  Farklı anahtar kelimeler deneyin
                </p>
              </div>
            )}

            {/* Popular Searches (shown when no query) */}
            {!query && (
              <div>
                <p className="text-body-xs text-leather-500 uppercase tracking-wider mb-3">
                  Popüler Aramalar
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-sand-100 hover:bg-sand-200 rounded-full text-body-sm text-leather-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
