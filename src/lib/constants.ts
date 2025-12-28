// Site Configuration
export const siteConfig = {
  name: "Halikarnas Sandals",
  description:
    "Premium el yapımı hakiki deri sandaletler. Bodrum'un antik mirası Halikarnas'tan esinlenen, zamansız şıklık ve üstün zanaatkarlık.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://halikarnassandals.com",
  ogImage: "/images/og-image.jpg",
  links: {
    instagram: "https://instagram.com/halikarnassandals",
    facebook: "https://facebook.com/halikarnassandals",
    twitter: "https://twitter.com/halikarnassandals",
  },
  contact: {
    email: "info@halikarnassandals.com",
    phone: "+90 252 XXX XX XX",
    address: "Bodrum, Muğla, Türkiye",
  },
};

// Navigation
export const mainNavigation = [
  {
    title: "Kadın",
    href: "/kadin",
    children: [
      { title: "Tüm Sandaletler", href: "/kadin" },
      { title: "Bodrum Sandalet", href: "/kadin/bodrum-sandalet" },
      { title: "Parmak Arası", href: "/kadin/parmak-arasi" },
      { title: "Bantlı Sandalet", href: "/kadin/bantli-sandalet" },
      { title: "Platform", href: "/kadin/platform" },
    ],
  },
  {
    title: "Erkek",
    href: "/erkek",
    children: [
      { title: "Tüm Sandaletler", href: "/erkek" },
      { title: "Klasik Sandalet", href: "/erkek/klasik-sandalet" },
      { title: "Parmak Arası", href: "/erkek/parmak-arasi" },
      { title: "Spor Sandalet", href: "/erkek/spor-sandalet" },
    ],
  },
  {
    title: "Koleksiyonlar",
    href: "/koleksiyonlar",
  },
  {
    title: "Hakkımızda",
    href: "/hakkimizda",
  },
];

export const footerNavigation = {
  shop: {
    title: "Alışveriş",
    links: [
      { title: "Kadın", href: "/kadin" },
      { title: "Erkek", href: "/erkek" },
      { title: "Yeni Gelenler", href: "/yeni-gelenler" },
      { title: "İndirimler", href: "/indirimler" },
    ],
  },
  customer: {
    title: "Müşteri Hizmetleri",
    links: [
      { title: "İletişim", href: "/iletisim" },
      { title: "SSS", href: "/sikca-sorulan-sorular" },
      { title: "Kargo ve Teslimat", href: "/kargo-teslimat" },
      { title: "İade ve Değişim", href: "/iade-degisim" },
    ],
  },
  company: {
    title: "Kurumsal",
    links: [
      { title: "Hakkımızda", href: "/hakkimizda" },
      { title: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
      { title: "Kullanım Koşulları", href: "/kullanim-kosullari" },
      { title: "KVKK", href: "/kvkk" },
    ],
  },
};

// Size Options
export const sizeOptions = {
  women: ["35", "36", "37", "38", "39", "40", "41"],
  men: ["39", "40", "41", "42", "43", "44", "45"],
  unisex: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
};

// Color Options (Turkish)
export const colorOptions = [
  { name: "Taba", hex: "#C17E61", slug: "taba" },
  { name: "Siyah", hex: "#2D2926", slug: "siyah" },
  { name: "Kahverengi", hex: "#4A3728", slug: "kahverengi" },
  { name: "Natural", hex: "#D4B896", slug: "natural" },
  { name: "Beyaz", hex: "#FFFFFF", slug: "beyaz" },
  { name: "Gold", hex: "#A68B5B", slug: "gold" },
  { name: "Gümüş", hex: "#C0C0C0", slug: "gumus" },
  { name: "Kırmızı", hex: "#C41E3A", slug: "kirmizi" },
  { name: "Turuncu", hex: "#FF8C00", slug: "turuncu" },
  { name: "Mürdüm", hex: "#702963", slug: "murdum" },
  { name: "Lacivert", hex: "#1B3A57", slug: "lacivert" },
  { name: "Yeşil", hex: "#355E3B", slug: "yesil" },
];

// Material Options
export const materialOptions = [
  { name: "Hakiki Deri", slug: "hakiki-deri" },
  { name: "Dana Derisi", slug: "dana-derisi" },
  { name: "Keçi Derisi", slug: "keci-derisi" },
  { name: "Nubuk", slug: "nubuk" },
  { name: "Süet", slug: "suet" },
];

// Sole Type Options
export const soleTypeOptions = [
  { name: "Kösele", slug: "kosele" },
  { name: "Kauçuk", slug: "kaucuk" },
  { name: "EVA", slug: "eva" },
  { name: "TPU", slug: "tpu" },
];

// Heel Height Options
export const heelHeightOptions = [
  { name: "Düz", slug: "duz", value: "0" },
  { name: "1-2 cm", slug: "1-2cm", value: "1-2" },
  { name: "3-4 cm", slug: "3-4cm", value: "3-4" },
  { name: "5-6 cm", slug: "5-6cm", value: "5-6" },
  { name: "7+ cm", slug: "7cm-ustu", value: "7+" },
];

// Sort Options
export const sortOptions = [
  { label: "Önerilen", value: "recommended" },
  { label: "En Yeniler", value: "newest" },
  { label: "Fiyat: Düşükten Yükseğe", value: "price-asc" },
  { label: "Fiyat: Yüksekten Düşüğe", value: "price-desc" },
  { label: "En Çok Satanlar", value: "bestseller" },
  { label: "En Çok Değerlendirilen", value: "rating" },
];

// Order Status Labels (Turkish)
export const orderStatusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  CONFIRMED: "Onaylandı",
  PROCESSING: "Hazırlanıyor",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
};

// Payment Status Labels (Turkish)
export const paymentStatusLabels: Record<string, string> = {
  PENDING: "Beklemede",
  PAID: "Ödendi",
  FAILED: "Başarısız",
  REFUNDED: "İade Edildi",
};

// Shipping Configuration
export const shippingConfig = {
  freeShippingThreshold: 500, // TRY
  standardShippingCost: 29.90, // TRY
  expressShippingCost: 49.90, // TRY
  estimatedDeliveryDays: {
    standard: "3-5 iş günü",
    express: "1-2 iş günü",
  },
};

// Tax Rate
export const TAX_RATE = 0.20; // 20% KDV

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;
export const REVIEWS_PER_PAGE = 5;

// Image Sizes
export const imageSizes = {
  thumbnail: { width: 100, height: 100 },
  card: { width: 400, height: 533 }, // 3:4 ratio
  product: { width: 800, height: 1067 }, // 3:4 ratio
  banner: { width: 1920, height: 823 }, // 21:9 ratio
  hero: { width: 1920, height: 1080 }, // 16:9 ratio
};

// Navigation Items (for Navbar and MobileMenu)
export const NAV_ITEMS = [
  {
    label: "Kadın",
    href: "/kadin",
    children: [
      { label: "Tüm Ürünler", href: "/kadin" },
      { label: "Bodrum Sandalet", href: "/kadin/bodrum-sandalet" },
      { label: "Bodrum Terlik", href: "/kadin/bodrum-terlik" },
      { label: "Takunyalar", href: "/kadin/takunyalar" },
    ],
  },
  {
    label: "Erkek",
    href: "/erkek",
    children: [
      { label: "Tüm Ürünler", href: "/erkek" },
      { label: "Bodrum Sandalet", href: "/erkek/bodrum-sandalet" },
      { label: "Bodrum Terlik", href: "/erkek/bodrum-terlik" },
    ],
  },
  {
    label: "Koleksiyonlar",
    href: "/koleksiyonlar",
  },
  {
    label: "Hakkımızda",
    href: "/hakkimizda",
  },
];

// Admin form için kategori seçenekleri
export const CATEGORY_OPTIONS = {
  KADIN: [
    { slug: "bodrum-sandalet", label: "Bodrum Sandalet" },
    { slug: "bodrum-terlik", label: "Bodrum Terlik" },
    { slug: "takunyalar", label: "Takunyalar" },
  ],
  ERKEK: [
    { slug: "bodrum-sandalet", label: "Bodrum Sandalet" },
    { slug: "bodrum-terlik", label: "Bodrum Terlik" },
  ],
};

// Placeholder Images (Unsplash)
export const PLACEHOLDER_IMAGES = {
  // Editorial/Lifestyle - Mediterranean theme
  mediterranean_beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  greek_architecture: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80",
  aegean_coast: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1920&q=80",
  santorini_vibes: "https://images.unsplash.com/photo-1570077188670-e3a8d3c6071d?w=1920&q=80",
  beach_sunset: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80",

  // Craftsman/Artisan - Verified leather working images
  leather_craft: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=1200&q=80",
  leather_workshop: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80",
  artisan_hands: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&q=80",
  leather_tools: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",

  // Texture
  leather_texture: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
};

// Cities in Turkey (for address form)
export const turkishCities = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kilis",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
];
