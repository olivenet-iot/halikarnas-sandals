import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Turkish Lira (TRY)
 */
export function formatPrice(
  price: number | string,
  options: {
    currency?: "TRY" | "USD" | "EUR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
): string {
  const { currency = "TRY", notation = "standard" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    notation,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

/**
 * Format date in Turkish locale
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 gün önce")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" }).format(
        -interval,
        unit
      );
    }
  }

  return "az önce";
}

/**
 * Slugify string with Turkish character support
 */
export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: "tr",
  });
}

/**
 * Generate order number
 * Format: HS-YYYYMMDD-XXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HS-${year}${month}${day}-${random}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0) return 0;
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj > new Date();
}

/**
 * Wait for a specified amount of time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validate Turkish phone number
 */
export function isValidTurkishPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Turkish phone numbers: 5XX XXX XX XX (10 digits) or with country code 90
  return /^(90)?5\d{9}$/.test(cleaned);
}

/**
 * Format Turkish phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith("90")) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  return phone;
}

/**
 * Get absolute URL
 */
export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}

/**
 * Product URL interface for getProductUrl
 */
interface ProductForUrl {
  sku: string;
  gender: "ERKEK" | "KADIN" | "UNISEX" | null;
  category?: { slug: string } | null;
}

/**
 * Generate product URL based on gender, category, and SKU
 * Format: /[gender]/[category-slug]/[sku]
 * Example: /kadin/bodrum-sandalet/BS-001
 */
export function getProductUrl(product: ProductForUrl): string {
  // UNISEX and null gender default to "kadin"
  const genderPath = product.gender === "ERKEK" ? "erkek" : "kadin";
  const categorySlug = product.category?.slug || "urun";
  return `/${genderPath}/${categorySlug}/${product.sku}`;
}
