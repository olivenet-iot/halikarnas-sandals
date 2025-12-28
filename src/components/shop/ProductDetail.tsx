"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RefreshCcw,
  Shield,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGrid } from "./ProductGrid";
import { ProductCardProps } from "./ProductCard";
import { ImageGallery } from "./ImageGallery";
import { ColorSelector } from "./ColorSelector";
import { SizeSelector } from "./SizeSelector";
import { MobileAddToCartBar } from "./MobileAddToCartBar";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  color?: string | null;
}

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorName: string;
  stock: number;
  sku?: string | null;
}

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  createdAt: string;
  user: {
    name?: string | null;
    image?: string | null;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  material?: string | null;
  soleType?: string | null;
  heelHeight?: string | null;
  careInstructions?: string | null;
  isNew: boolean;
  isBestseller: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  category: { name: string; slug: string } | null;
  collection: { name: string; slug: string } | null;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

interface ProductDetailProps {
  product: Product;
  relatedProducts: ProductCardProps[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  // Get unique colors
  const colors = useMemo(() => {
    const colorMap = new Map<string, { hex: string; name: string }>();
    product.variants.forEach((v) => {
      if (!colorMap.has(v.color)) {
        colorMap.set(v.color, { hex: v.color, name: v.colorName });
      }
    });
    return Array.from(colorMap.values());
  }, [product.variants]);

  // Get unique sizes (sorted)
  const sizes = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.size))).sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [product.variants]);

  // State
  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Stock map for colors: total stock per color
  const colorStockMap = useMemo(() => {
    const map: Record<string, number> = {};
    product.variants.forEach((v) => {
      map[v.color] = (map[v.color] || 0) + v.stock;
    });
    return map;
  }, [product.variants]);

  // Stock map for sizes (filtered by selected color)
  const sizeStockMap = useMemo(() => {
    const map: Record<string, number> = {};
    product.variants
      .filter((v) => v.color === selectedColor)
      .forEach((v) => {
        map[v.size] = v.stock;
      });
    return map;
  }, [product.variants, selectedColor]);

  // Filter images by selected color
  const filteredImages = useMemo(() => {
    if (!selectedColor) return product.images;

    const selectedColorName = colors.find((c) => c.hex === selectedColor)?.name;
    if (!selectedColorName) return product.images;

    const colorImages = product.images.filter(
      (img) => img.color === selectedColorName || !img.color
    );

    return colorImages.length > 0 ? colorImages : product.images;
  }, [product.images, selectedColor, colors]);

  // Handle color change - reset size
  const handleColorChange = (colorHex: string) => {
    setSelectedColor(colorHex);
    setSelectedSize("");
  };

  // Get current variant
  const currentVariant = useMemo(() => {
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product.variants, selectedColor, selectedSize]);

  // Get stock for selected variant
  const stock = currentVariant?.stock || 0;
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  // Discount calculation
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Beden Secin",
        description: "Lutfen bir beden secin.",
        variant: "destructive",
      });
      return;
    }

    if (!currentVariant || !isInStock) {
      toast({
        title: "Stok Yok",
        description: "Sectiginiz varyant stokta yok.",
        variant: "destructive",
      });
      return;
    }

    const colorInfo = colors.find((c) => c.hex === selectedColor);

    addItem({
      id: product.id,
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      gender: product.gender,
      categorySlug: product.category?.slug || null,
      color: selectedColor,
      colorName: colorInfo?.name || "",
      size: selectedSize,
      price: product.price,
      compareAtPrice: product.compareAtPrice || undefined,
      image: product.images[0]?.url || "",
      maxQuantity: stock,
      quantity,
    });

    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  // Breadcrumb gender path
  const genderPath = product.gender === "ERKEK" ? "erkek" : "kadin";

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="container-custom py-4">
        <nav className="flex items-center gap-2 text-body-sm text-leather-500">
          <Link href="/" className="hover:text-aegean-600 transition-colors">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4" />
          {product.category && (
            <>
              <Link
                href={`/${genderPath}/${product.category.slug}`}
                className="hover:text-aegean-600 transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-leather-700">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery
              images={filteredImages}
              productName={product.name}
              badges={{
                isNew: product.isNew,
                discount,
                isBestseller: product.isBestseller,
              }}
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6 pb-24 lg:pb-0">
            {/* Title & Price Section */}
            <div>
              {product.collection && (
                <Link
                  href={`/koleksiyonlar/${product.collection.slug}`}
                  className="text-body-sm text-aegean-600 hover:text-aegean-700 transition-colors"
                >
                  {product.collection.name}
                </Link>
              )}
              <h1 className="font-accent text-heading-2 text-leather-900 mt-1">
                {product.name}
              </h1>

              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.round(product.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-sand-200 text-sand-200"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-body-sm text-leather-600">
                    ({product.reviewCount} degerlendirme)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-heading-3 font-bold text-leather-900">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-heading-5 text-leather-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-body-md text-leather-600">
                {product.shortDescription}
              </p>
            )}

            <hr className="border-sand-200" />

            {/* Color Selection */}
            {colors.length > 0 && (
              <ColorSelector
                colors={colors}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                colorStockMap={colorStockMap}
              />
            )}

            <hr className="border-sand-200" />

            {/* Size Selection */}
            {sizes.length > 0 && (
              <SizeSelector
                sizes={sizes}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                sizeStockMap={sizeStockMap}
              />
            )}

            {/* Stock Status */}
            {selectedSize && (
              <div>
                {isLowStock ? (
                  <span className="text-body-sm text-terracotta-600 font-medium">
                    Son {stock} urun!
                  </span>
                ) : isInStock ? (
                  <span className="text-body-sm text-green-600 flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Stokta var
                  </span>
                ) : (
                  <span className="text-body-sm text-red-600">Stokta yok</span>
                )}
              </div>
            )}

            <hr className="border-sand-200" />

            {/* Quantity & Add to Cart - Hidden on mobile (sticky bar handles it) */}
            <div className="hidden lg:flex gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-sand-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-3 text-leather-600 hover:text-leather-800 disabled:text-sand-400"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-body-md font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stock || 10, q + 1))}
                  disabled={quantity >= (stock || 10)}
                  className="p-3 text-leather-600 hover:text-leather-800 disabled:text-sand-400"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || !isInStock}
                className="flex-1 btn-primary"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Sepete Ekle
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </Button>
            </div>

            {/* Mobile: Wishlist button only (Add to Cart in sticky bar) */}
            <div className="lg:hidden flex justify-end">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-sand-200">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-aegean-600 mb-2" />
                <p className="text-body-xs text-leather-600">
                  500TL uzeri ucretsiz kargo
                </p>
              </div>
              <div className="text-center">
                <RefreshCcw className="h-6 w-6 mx-auto text-aegean-600 mb-2" />
                <p className="text-body-xs text-leather-600">15 gun iade</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-aegean-600 mb-2" />
                <p className="text-body-xs text-leather-600">Guvenli odeme</p>
              </div>
            </div>

            {/* Share */}
            <div className="py-4">
              <button className="flex items-center gap-2 text-body-sm text-leather-600 hover:text-aegean-600 transition-colors">
                <Share2 className="h-4 w-4" />
                Paylas
              </button>
            </div>

            {/* SKU */}
            <p className="text-xs text-leather-400">
              SKU: {currentVariant?.sku || product.sku}
            </p>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-sand-200 bg-transparent h-auto p-0 rounded-none">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-aegean-600 data-[state=active]:bg-transparent px-6 py-4"
              >
                Urun Detaylari
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-aegean-600 data-[state=active]:bg-transparent px-6 py-4"
              >
                Kargo & Iade
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-aegean-600 data-[state=active]:bg-transparent px-6 py-4"
              >
                Degerlendirmeler ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-heading-5 text-leather-800 mb-4">
                    Urun Aciklamasi
                  </h3>
                  <div className="prose prose-leather max-w-none">
                    <p className="text-leather-600">
                      {product.description || "Urun aciklamasi bulunmuyor."}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-heading-5 text-leather-800 mb-4">
                    Ozellikler
                  </h3>
                  <dl className="space-y-3">
                    {product.material && (
                      <div className="flex justify-between py-2 border-b border-sand-200">
                        <dt className="text-leather-600">Materyal</dt>
                        <dd className="text-leather-800 font-medium">
                          {product.material}
                        </dd>
                      </div>
                    )}
                    {product.soleType && (
                      <div className="flex justify-between py-2 border-b border-sand-200">
                        <dt className="text-leather-600">Taban</dt>
                        <dd className="text-leather-800 font-medium">
                          {product.soleType}
                        </dd>
                      </div>
                    )}
                    {product.heelHeight && (
                      <div className="flex justify-between py-2 border-b border-sand-200">
                        <dt className="text-leather-600">Topuk Yuksekligi</dt>
                        <dd className="text-leather-800 font-medium">
                          {product.heelHeight}
                        </dd>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex justify-between py-2 border-b border-sand-200">
                        <dt className="text-leather-600">Urun Kodu</dt>
                        <dd className="text-leather-800 font-medium">
                          {product.sku}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {product.careInstructions && (
                    <div className="mt-6">
                      <h4 className="text-body-md font-medium text-leather-800 mb-2">
                        Bakim Onerileri
                      </h4>
                      <p className="text-body-sm text-leather-600">
                        {product.careInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="py-8">
              <div className="max-w-2xl">
                <Accordion type="single" collapsible defaultValue="shipping">
                  <AccordionItem value="shipping">
                    <AccordionTrigger>Kargo Bilgileri</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-leather-600">
                        <li>500TL uzeri siparislerde ucretsiz kargo</li>
                        <li>Standart kargo: 3-5 is gunu</li>
                        <li>Ekspres kargo: 1-2 is gunu (+19.90TL)</li>
                        <li>Siparisiniz ayni gun kargoya verilir (14:00&apos;e kadar)</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="returns">
                    <AccordionTrigger>Iade & Degisim</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-leather-600">
                        <li>15 gun icinde kosulsuz iade</li>
                        <li>Urun kullanilmamis ve orijinal ambalajinda olmalidir</li>
                        <li>Iade kargo ucretsizdir</li>
                        <li>Degisim icin musteri hizmetleriyle iletisime gecin</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-8">
              {product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-sand-200 pb-6 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center">
                            <span className="text-body-md font-medium text-leather-600">
                              {review.user.name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="text-body-md font-medium text-leather-800">
                              {review.user.name || "Anonim"}
                            </p>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-sand-200 text-sand-200"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-body-xs text-leather-500">
                          {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      {review.title && (
                        <p className="text-body-md font-medium text-leather-800 mb-1">
                          {review.title}
                        </p>
                      )}
                      {review.comment && (
                        <p className="text-body-md text-leather-600">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-leather-600">
                    Henuz degerlendirme yapilmamis.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Ilk Degerlendirmeyi Yap
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-accent text-heading-3 text-leather-900 mb-8">
              Bunlari da Begenebilirsiniz
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <MobileAddToCartBar
        price={product.price}
        onAddToCart={handleAddToCart}
        disabled={!selectedSize || !isInStock}
        disabledReason={
          !selectedSize
            ? "Beden seciniz"
            : !isInStock
            ? "Stokta yok"
            : undefined
        }
      />
    </div>
  );
}
