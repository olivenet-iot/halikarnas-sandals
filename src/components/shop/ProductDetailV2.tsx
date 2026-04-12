"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ImageGalleryV2 } from "./ImageGalleryV2";
import { ColorSelectorV2 } from "./ColorSelectorV2";
import { SizeSelectorV2 } from "./SizeSelectorV2";
import { MobileAddToCartBarV2 } from "./MobileAddToCartBarV2";
import { ProductGridV2 } from "./ProductGridV2";
import type { ProductCardV2Props } from "./ProductCardV2";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, getProductUrl, cn } from "@/lib/utils";
import { sectionRevealV2, viewportV2 } from "@/lib/animations";

// --- Types ---

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
  isBestseller: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  category: { name: string; slug: string } | null;
  reviews: {
    id: string;
    rating: number;
    title?: string | null;
    comment?: string | null;
    createdAt: string;
    user: { name?: string | null; image?: string | null };
  }[];
  averageRating: number;
  reviewCount: number;
}

interface ProductDetailV2Props {
  product: Product;
  relatedProducts: ProductCardV2Props[];
}

// --- Component ---

export function ProductDetailV2({
  product,
  relatedProducts,
}: ProductDetailV2Props) {
  const { addItem } = useCartStore();
  const {
    addItem: addWishlistItem,
    removeItem: removeWishlistItem,
    isInWishlist,
  } = useWishlistStore();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Refs for scroll animation
  const infoSectionRef = useRef(null);
  const relatedSectionRef = useRef(null);
  const infoInView = useInView(infoSectionRef, { once: true, amount: 0.15 });
  const relatedInView = useInView(relatedSectionRef, {
    once: true,
    amount: 0.15,
  });

  // --- Derived data ---

  const colors = useMemo(() => {
    const colorMap = new Map<string, { hex: string; name: string }>();
    product.variants.forEach((v) => {
      if (!colorMap.has(v.color)) {
        colorMap.set(v.color, { hex: v.color, name: v.colorName });
      }
    });
    return Array.from(colorMap.values());
  }, [product.variants]);

  const sizes = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.size))).sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [product.variants]);

  const isAllOutOfStock = useMemo(() => {
    return product.variants.every((v) => v.stock === 0);
  }, [product.variants]);

  // --- State ---

  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex || "");
  const [selectedSize, setSelectedSize] = useState(
    sizes.length === 1 ? sizes[0] : ""
  );
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  // --- Stock maps ---

  const colorStockMap = useMemo(() => {
    const map: Record<string, number> = {};
    product.variants.forEach((v) => {
      map[v.color] = (map[v.color] || 0) + v.stock;
    });
    return map;
  }, [product.variants]);

  const sizeStockMap = useMemo(() => {
    const map: Record<string, number> = {};
    product.variants
      .filter((v) => v.color === selectedColor)
      .forEach((v) => {
        map[v.size] = v.stock;
      });
    return map;
  }, [product.variants, selectedColor]);

  // --- Image filtering ---

  const filteredImages = useMemo(() => {
    if (!selectedColor) return product.images;
    const selectedColorName = colors.find(
      (c) => c.hex === selectedColor
    )?.name;
    if (!selectedColorName) return product.images;
    const colorImages = product.images.filter(
      (img) => img.color === selectedColorName || !img.color
    );
    return colorImages.length > 0 ? colorImages : product.images;
  }, [product.images, selectedColor, colors]);

  // --- Current variant ---

  const currentVariant = useMemo(() => {
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product.variants, selectedColor, selectedSize]);

  const stock = currentVariant?.stock || 0;
  const isInStock = stock > 0;

  // --- Handlers ---

  const handleColorChange = (colorHex: string) => {
    setSelectedColor(colorHex);
    setSelectedSize(sizes.length === 1 ? sizes[0] : "");
  };

  const productUrl = getProductUrl({
    slug: product.slug,
    gender: product.gender,
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Beden Se\u00e7in",
        description: "L\u00fctfen bir beden se\u00e7in.",
        variant: "destructive",
      });
      return;
    }

    if (!currentVariant || !isInStock) {
      toast({
        title: "Stok Yok",
        description: "Se\u00e7ti\u011finiz varyant stokta yok.",
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
      quantity: 1,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlistClick = async () => {
    if (!session?.user) {
      router.push(`/giris?callbackUrl=${productUrl}`);
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isWishlisted) {
        const success = await removeWishlistItem(product.id);
        if (success) {
          toast({
            title: "Favorilerden kald\u0131r\u0131ld\u0131",
            description: `${product.name} favorilerinizden kald\u0131r\u0131ld\u0131.`,
          });
        }
      } else {
        const success = await addWishlistItem(product.id);
        if (success) {
          toast({
            title: "Favorilere eklendi",
            description: `${product.name} favorilerinize eklendi.`,
          });
        }
      }
    } catch {
      toast({
        title: "Hata",
        description: "Bir hata olu\u015ftu, l\u00fctfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // --- Button text ---

  const getButtonText = () => {
    if (addedToCart) return "Eklendi \u2713";
    if (isAllOutOfStock) return "Stokta Yok";
    if (!selectedSize) return "Beden Se\u00e7in";
    if (!isInStock) return "Stokta Yok";
    return "Sepete Ekle";
  };

  const isButtonDisabled =
    addedToCart || isAllOutOfStock || !selectedSize || !isInStock;

  // --- Render ---

  return (
    <div className="bg-v2-bg-primary min-h-screen">
      {/* Product Hero Section */}
      <section className="container-v2 pt-8 md:pt-12 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <ImageGalleryV2
              images={filteredImages}
              productName={product.name}
            />
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-[88px] lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto space-y-6 pb-20 md:pb-0">
            {/* Product Name */}
            <h1 className="font-serif font-light text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.1] text-v2-text-primary">
              {product.name}
            </h1>

            {/* Out of Stock — global */}
            {isAllOutOfStock && (
              <p className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted">
                Stokta Yok
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-inter text-lg text-v2-text-primary">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="font-inter text-sm text-v2-text-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="font-inter text-v2-body text-v2-text-muted max-w-[45ch]">
                {product.shortDescription}
              </p>
            )}

            <hr className="border-v2-border-subtle" />

            {/* Color Selector */}
            {colors.length > 0 && (
              <ColorSelectorV2
                colors={colors}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                colorStockMap={colorStockMap}
              />
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <SizeSelectorV2
                sizes={sizes}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                sizeStockMap={sizeStockMap}
              />
            )}

            {/* Add to Cart Button — desktop */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={cn(
                "hidden md:block max-w-sm py-4 px-8 font-inter text-sm transition-all duration-[400ms]",
                addedToCart
                  ? "bg-v2-text-primary text-white border border-v2-text-primary"
                  : "border border-v2-text-primary text-v2-text-primary bg-transparent hover:bg-v2-text-primary hover:text-white",
                isButtonDisabled &&
                  !addedToCart &&
                  "opacity-40 cursor-not-allowed"
              )}
            >
              {getButtonText()}
            </button>

            {/* Wishlist Link */}
            <div className="mt-4">
              <button
                onClick={handleWishlistClick}
                disabled={isWishlistLoading}
                className="inline-flex items-center gap-1.5 font-inter text-xs text-v2-text-muted link-underline-v2 disabled:opacity-50"
              >
                {isWishlistLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Heart
                    className={cn(
                      "h-3.5 w-3.5",
                      isWishlisted && "fill-current"
                    )}
                  />
                )}
                {isWishlisted ? "Favorilerde" : "Favorilere Ekle"}
              </button>
            </div>

            {/* SKU */}
            <p className="font-inter text-xs text-v2-text-muted/60 pt-2">
              SKU: {currentVariant?.sku || product.sku}
            </p>
          </div>
        </div>
      </section>

      {/* Product Information Sections — sequential, no tabs */}
      <motion.section
        ref={infoSectionRef}
        initial="hidden"
        animate={infoInView ? "visible" : "hidden"}
        variants={sectionRevealV2}
        className="container-v2 pb-12 md:pb-20"
      >
        <div className="max-w-[900px] mx-auto space-y-12 md:space-y-16">
          {/* Urun Detaylari */}
          {(product.description || product.material) && (
            <div>
              <h3 className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted mb-4">
                {"\u00DCr\u00FCn Detaylar\u0131"}
              </h3>
              {product.description && (
                <p className="font-inter text-v2-body text-v2-text-muted leading-[1.7] mb-6">
                  {product.description}
                </p>
              )}
              {(product.material ||
                product.soleType ||
                product.heelHeight) && (
                <dl className="mt-8 border-t border-v2-border-subtle">
                  {product.material && (
                    <div className="grid grid-cols-2 py-5 border-b border-v2-border-subtle">
                      <dt className="font-inter text-sm text-v2-text-muted">
                        Materyal
                      </dt>
                      <dd className="font-inter text-sm text-v2-text-primary text-right">
                        {product.material}
                      </dd>
                    </div>
                  )}
                  {product.soleType && (
                    <div className="grid grid-cols-2 py-5 border-b border-v2-border-subtle">
                      <dt className="font-inter text-sm text-v2-text-muted">
                        Taban
                      </dt>
                      <dd className="font-inter text-sm text-v2-text-primary text-right">
                        {product.soleType}
                      </dd>
                    </div>
                  )}
                  {product.heelHeight && (
                    <div className="grid grid-cols-2 py-5 border-b border-v2-border-subtle">
                      <dt className="font-inter text-sm text-v2-text-muted">
                        {"Topuk Y\u00fcksekli\u011fi"}
                      </dt>
                      <dd className="font-inter text-sm text-v2-text-primary text-right">
                        {product.heelHeight}
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </div>
          )}

          {/* Kargo & Iade */}
          <div>
            <h3 className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted mb-4">
              {"Kargo & \u0130ade"}
            </h3>
            <div className="space-y-4 font-inter text-sm text-v2-text-muted leading-[1.7]">
              <div>
                <p className="text-v2-text-primary font-medium mb-1">
                  Kargo
                </p>
                <p>
                  {"T\u00fcrkiye i\u00e7i \u00fccretsiz kargo. Sipari\u015finiz 3\u20135 i\u015f g\u00fcn\u00fc i\u00e7inde kargoya verilir."}
                </p>
              </div>
              <div>
                <p className="text-v2-text-primary font-medium mb-1">
                  {"\u0130ade"}
                </p>
                <p>
                  {"15 g\u00fcn i\u00e7inde kullan\u0131lmam\u0131\u015f \u00fcr\u00fcnlerde ko\u015fulsuz iade."}
                </p>
              </div>
            </div>
          </div>

          {/* Malzeme & Bakim */}
          {product.careInstructions && (
            <div>
              <h3 className="font-inter text-v2-label uppercase tracking-[0.2em] text-v2-text-muted mb-4">
{"Malzeme & Bak\u0131m"}
              </h3>
              <p className="font-inter text-sm text-v2-text-muted leading-[1.7]">
                {product.careInstructions}
              </p>
            </div>
          )}

        </div>
      </motion.section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          ref={relatedSectionRef}
          initial="hidden"
          animate={relatedInView ? "visible" : "hidden"}
          variants={sectionRevealV2}
          viewport={viewportV2}
          className="container-v2 section-v2 border-t border-v2-border-subtle"
        >
          <h2 className="font-serif font-light text-v2-section-sm md:text-v2-section text-v2-text-primary mb-10 md:mb-16">
{"At\u00f6lyeden Di\u011ferleri"}
          </h2>
          <ProductGridV2 products={relatedProducts} />
        </motion.section>
      )}

      {/* Mobile Sticky Add to Cart Bar */}
      <MobileAddToCartBarV2
        price={product.price}
        onAddToCart={handleAddToCart}
        disabled={isButtonDisabled}
        disabledReason={
          isAllOutOfStock
            ? "Stokta Yok"
            : !selectedSize
            ? "Beden Se\u00e7in"
            : !isInStock
            ? "Stokta Yok"
            : undefined
        }
      />
    </div>
  );
}
