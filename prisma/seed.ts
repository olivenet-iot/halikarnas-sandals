import { PrismaClient, Gender, ProductStatus, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // 1. Create Admin User
  // ============================================
  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("Admin123!", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@halikarnassandals.com" },
    update: {},
    create: {
      email: "admin@halikarnassandals.com",
      name: "Admin",
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`✓ Admin user created: ${adminUser.email}`);

  // ============================================
  // 2. Create Categories
  // ============================================
  console.log("Creating categories...");

  // New category structure: same slug, different gender
  const categories = [
    // Kadın kategorileri
    { name: "Bodrum Sandalet", slug: "bodrum-sandalet", gender: Gender.KADIN, description: "El yapımı Bodrum sandaletleri", position: 1 },
    { name: "Bodrum Terlik", slug: "bodrum-terlik", gender: Gender.KADIN, description: "Rahat Bodrum terlikleri", position: 2 },
    { name: "Takunyalar", slug: "takunyalar", gender: Gender.KADIN, description: "Geleneksel el yapımı takunyalar", position: 3 },
    // Erkek kategorileri
    { name: "Bodrum Sandalet", slug: "bodrum-sandalet", gender: Gender.ERKEK, description: "El yapımı erkek Bodrum sandaletleri", position: 1 },
    { name: "Bodrum Terlik", slug: "bodrum-terlik", gender: Gender.ERKEK, description: "Erkek Bodrum terlikleri", position: 2 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug_gender: { slug: cat.slug, gender: cat.gender } },
      update: { name: cat.name, description: cat.description, position: cat.position },
      create: { ...cat, isActive: true },
    });
  }

  console.log("✓ Categories created");

  // ============================================
  // 3. Create Collections
  // ============================================
  console.log("Creating collections...");

  const collections = [
    {
      name: "Yaz 2024 Koleksiyonu",
      slug: "yaz-2024",
      description: "2024 yaz sezonunun en şık sandaletleri",
      isFeatured: true,
    },
    {
      name: "El Yapımı Özel Seri",
      slug: "el-yapimi-ozel-seri",
      description: "Ustalarımızın elinden çıkan özel tasarımlar",
      isFeatured: true,
    },
    {
      name: "Bodrum Esintisi",
      slug: "bodrum-esintisi",
      description: "Bodrum'un ruhunu yansıtan tasarımlar",
      isFeatured: false,
    },
  ];

  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: {
        name: col.name,
        slug: col.slug,
        description: col.description,
        isFeatured: col.isFeatured,
        isActive: true,
      },
    });
  }
  console.log("✓ Collections created");

  // ============================================
  // 4. Create Sample Products
  // ============================================
  console.log("Creating sample products...");

  // Get category IDs using compound unique
  const kadinBodrumCategory = await prisma.category.findUnique({
    where: { slug_gender: { slug: "bodrum-sandalet", gender: Gender.KADIN } },
  });
  const kadinTerlikCategory = await prisma.category.findUnique({
    where: { slug_gender: { slug: "bodrum-terlik", gender: Gender.KADIN } },
  });
  const erkekBodrumCategory = await prisma.category.findUnique({
    where: { slug_gender: { slug: "bodrum-sandalet", gender: Gender.ERKEK } },
  });

  const yaz2024Collection = await prisma.collection.findUnique({
    where: { slug: "yaz-2024" },
  });

  // Sample Products Data
  const products = [
    {
      name: "Aegean Sandalet",
      slug: "aegean-sandalet",
      description: `Ege'nin masmavi sularından ilham alan Aegean Sandalet, zarif tasarımı ve üstün konforuyla yaz gardırobunuzun vazgeçilmezi olacak.

%100 hakiki dana derisinden üretilen bu sandalet, el işçiliğiyle hazırlanmış ve her detayında kaliteyi yansıtıyor. Yumuşak iç tabanı sayesinde uzun süre rahatça kullanabilirsiniz.

Özellikler:
• %100 Hakiki Dana Derisi
• El yapımı üretim
• Kösele taban
• Anatomik iç taban
• Türkiye'de üretilmiştir`,
      shortDescription:
        "Ege'nin masmavi sularından ilham alan zarif sandalet",
      basePrice: 1299.0,
      compareAtPrice: 1599.0,
      sku: "HS-W-AEG-001",
      material: "Hakiki Dana Derisi",
      soleType: "Kösele",
      heelHeight: "Düz",
      gender: Gender.KADIN,
      categoryId: kadinBodrumCategory?.id,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: true,
      isBestSeller: true,
      colors: [
        { name: "Taba", hex: "#C17E61" },
        { name: "Siyah", hex: "#2D2926" },
        { name: "Natural", hex: "#D4B896" },
      ],
      sizes: ["36", "37", "38", "39", "40"],
    },
    {
      name: "Bodrum Classic",
      slug: "bodrum-classic",
      description: `Bodrum'un efsanevi sandaletlerinden esinlenen Bodrum Classic, zamansız tasarımıyla her kombine uyum sağlar.

Yüzyıllardır süregelen zanaatkarlık geleneğimizin bir yansıması olan bu model, hem şıklığı hem de rahatlığı bir arada sunuyor.

Özellikler:
• %100 Hakiki Keçi Derisi
• El dikişi detaylar
• Kauçuk taban
• Nefes alan iç astar
• Türkiye'de üretilmiştir`,
      shortDescription: "Bodrum'un zamansız klasiği, modern dokunuşlarla",
      basePrice: 1499.0,
      compareAtPrice: null,
      sku: "HS-W-BOD-001",
      material: "Hakiki Keçi Derisi",
      soleType: "Kauçuk",
      heelHeight: "Düz",
      gender: Gender.KADIN,
      categoryId: kadinBodrumCategory?.id,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: "Kahverengi", hex: "#4A3728" },
        { name: "Taba", hex: "#C17E61" },
      ],
      sizes: ["35", "36", "37", "38", "39", "40", "41"],
    },
    {
      name: "Mediterranean Thong",
      slug: "mediterranean-thong",
      description: `Akdeniz esintilerini ayaklarınıza taşıyan Mediterranean Thong, minimalist tasarımı ve üstün kalitesiyle dikkat çekiyor.

İnce bantları ve zarif görünümüyle hem plajda hem şehirde rahatlıkla kullanabileceğiniz bu model, yaz aylarının favorisi olmaya aday.

Özellikler:
• %100 Hakiki Deri
• Ergonomik tasarım
• Hafif EVA taban
• Ter emici iç taban
• Türkiye'de üretilmiştir`,
      shortDescription: "Minimalist tasarım, maksimum şıklık",
      basePrice: 899.0,
      compareAtPrice: 1199.0,
      sku: "HS-W-MED-001",
      material: "Hakiki Deri",
      soleType: "EVA",
      heelHeight: "Düz",
      gender: Gender.KADIN,
      categoryId: kadinTerlikCategory?.id,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: "Gold", hex: "#A68B5B" },
        { name: "Gümüş", hex: "#C0C0C0" },
        { name: "Siyah", hex: "#2D2926" },
      ],
      sizes: ["36", "37", "38", "39", "40"],
    },
    {
      name: "Halikarnas Erkek",
      slug: "halikarnas-erkek",
      description: `Antik Halikarnas'ın ihtişamından ilham alan bu sandalet, erkekler için tasarlanmış premium bir model.

Sağlam yapısı ve konforlu tabanıyla günlük kullanım için ideal olan bu sandalet, her adımınızda kaliteyi hissettirecek.

Özellikler:
• %100 Hakiki Dana Derisi
• Güçlendirilmiş dikiş detayları
• Kaymaz kauçuk taban
• Yastıklı iç taban
• Türkiye'de üretilmiştir`,
      shortDescription: "Erkekler için tasarlanmış premium sandalet",
      basePrice: 1599.0,
      compareAtPrice: null,
      sku: "HS-M-HAL-001",
      material: "Hakiki Dana Derisi",
      soleType: "Kauçuk",
      heelHeight: "Düz",
      gender: Gender.ERKEK,
      categoryId: erkekBodrumCategory?.id,
      status: ProductStatus.ACTIVE,
      isFeatured: true,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: "Kahverengi", hex: "#4A3728" },
        { name: "Siyah", hex: "#2D2926" },
        { name: "Taba", hex: "#C17E61" },
      ],
      sizes: ["40", "41", "42", "43", "44", "45"],
    },
    {
      name: "Aegean Erkek",
      slug: "aegean-erkek",
      description: `Aegean serisinin erkek versiyonu, aynı kalite ve zanaatkarlıkla üretilmiştir.

Geniş kalıbı ve rahat yapısıyla uzun yürüyüşlerde bile konfor sağlayan bu model, yaz aylarının vazgeçilmezi.

Özellikler:
• %100 Hakiki Dana Derisi
• El yapımı üretim
• Kösele taban
• Anatomik iç taban
• Türkiye'de üretilmiştir`,
      shortDescription: "Aegean serisinin erkek versiyonu",
      basePrice: 1399.0,
      compareAtPrice: 1699.0,
      sku: "HS-M-AEG-001",
      material: "Hakiki Dana Derisi",
      soleType: "Kösele",
      heelHeight: "Düz",
      gender: Gender.ERKEK,
      categoryId: erkekBodrumCategory?.id,
      status: ProductStatus.ACTIVE,
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: "Taba", hex: "#C17E61" },
        { name: "Kahverengi", hex: "#4A3728" },
      ],
      sizes: ["39", "40", "41", "42", "43", "44"],
    },
  ];

  for (const productData of products) {
    const { colors, sizes, categoryId, ...product } = productData;

    if (!categoryId) {
      console.log(`Skipping ${product.name} - no category found`);
      continue;
    }

    // Create product
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        categoryId,
        publishedAt: new Date(),
      },
    });

    // Create variants (color x size combinations)
    let variantIndex = 0;
    for (const color of colors) {
      for (const size of sizes) {
        variantIndex++;
        const variantSku = `${product.sku}-${color.name.toUpperCase().slice(0, 3)}-${size}`;

        await prisma.productVariant.upsert({
          where: { sku: variantSku },
          update: {},
          create: {
            productId: createdProduct.id,
            size,
            color: color.name,
            colorHex: color.hex,
            sku: variantSku,
            stock: Math.floor(Math.random() * 20) + 5, // Random stock 5-25
          },
        });
      }
    }

    // Product-specific images from Unsplash
    const productImages: Record<string, string[]> = {
      "aegean-sandalet": [
        "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800",
        "https://images.unsplash.com/photo-1562273138-f9c74f4ff99e?q=80&w=800",
        "https://images.unsplash.com/photo-1529025530948-67e8a5c69c3d?q=80&w=800",
      ],
      "bodrum-classic": [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800",
        "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800",
      ],
      "mediterranean-thong": [
        "https://images.unsplash.com/photo-1582897085656-c636d006a246?q=80&w=800",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800",
        "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=800",
      ],
      "halikarnas-erkek": [
        "https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=800",
        "https://images.unsplash.com/photo-1491553895911-0055uj06138?q=80&w=800",
        "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=800",
      ],
      "aegean-erkek": [
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=800",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800",
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800",
      ],
    };

    // Default images if product slug not found
    const defaultImages = [
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800",
      "https://images.unsplash.com/photo-1562273138-f9c74f4ff99e?q=80&w=800",
      "https://images.unsplash.com/photo-1529025530948-67e8a5c69c3d?q=80&w=800",
    ];

    const imageUrls = productImages[product.slug] || defaultImages;

    for (let i = 0; i < imageUrls.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: imageUrls[i],
          alt: `${product.name} - Görsel ${i + 1}`,
          position: i,
          isPrimary: i === 0,
        },
      });
    }

    // Add to collection
    if (yaz2024Collection && product.isNew) {
      await prisma.collectionProduct.upsert({
        where: {
          collectionId_productId: {
            collectionId: yaz2024Collection.id,
            productId: createdProduct.id,
          },
        },
        update: {},
        create: {
          collectionId: yaz2024Collection.id,
          productId: createdProduct.id,
        },
      });
    }

    console.log(`✓ Product created: ${product.name}`);
  }

  // ============================================
  // 5. Create FAQs
  // ============================================
  console.log("Creating FAQs...");

  const faqs = [
    {
      question: "Siparişim ne zaman teslim edilir?",
      answer:
        "Siparişleriniz, ödeme onayından sonra 1-3 iş günü içinde kargoya verilir. Türkiye genelinde teslimat süresi 2-5 iş günüdür.",
      category: "shipping",
      sortOrder: 1,
    },
    {
      question: "Ücretsiz kargo var mı?",
      answer:
        "Evet! 500 TL ve üzeri siparişlerinizde kargo ücretsizdir. Bu tutarın altındaki siparişlerde standart kargo ücreti 29,90 TL'dir.",
      category: "shipping",
      sortOrder: 2,
    },
    {
      question: "İade ve değişim koşulları nelerdir?",
      answer:
        "Ürünlerimizi, teslim aldığınız tarihten itibaren 15 gün içinde iade veya değişim yapabilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir.",
      category: "returns",
      sortOrder: 1,
    },
    {
      question: "Sandaletlerim nasıl temizlenir?",
      answer:
        "Deri sandaletlerinizi nemli bir bezle silebilirsiniz. Derin temizlik için deri bakım ürünleri kullanmanızı öneririz. Direkt güneş ışığından ve ısıdan uzak tutun.",
      category: "products",
      sortOrder: 1,
    },
    {
      question: "Beden seçimi nasıl yapmalıyım?",
      answer:
        "Sandaletlerimiz standart Avrupa numaralarına uygundur. Geniş ayak yapınız varsa bir numara büyük tercih etmenizi öneririz. Beden tablomuzu inceleyebilirsiniz.",
      category: "products",
      sortOrder: 2,
    },
    {
      question: "Ödeme seçenekleri nelerdir?",
      answer:
        "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Kredi kartı ile 3, 6 veya 9 taksit seçeneklerimiz mevcuttur.",
      category: "payment",
      sortOrder: 1,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq,
    });
  }
  console.log("✓ FAQs created");

  // ============================================
  // 6. Create Site Settings
  // ============================================
  console.log("Creating site settings...");

  const settings = [
    {
      key: "site_name",
      value: "Halikarnas Sandals",
      type: "string",
      group: "general",
    },
    {
      key: "site_description",
      value:
        "Premium el yapımı hakiki deri sandaletler. Bodrum'un antik mirası Halikarnas'tan esinlenen, zamansız şıklık.",
      type: "string",
      group: "general",
    },
    {
      key: "contact_email",
      value: "info@halikarnassandals.com",
      type: "string",
      group: "general",
    },
    {
      key: "contact_phone",
      value: "+90 252 XXX XX XX",
      type: "string",
      group: "general",
    },
    {
      key: "free_shipping_threshold",
      value: "500",
      type: "number",
      group: "shipping",
    },
    {
      key: "standard_shipping_cost",
      value: "29.90",
      type: "number",
      group: "shipping",
    },
    {
      key: "tax_rate",
      value: "0.20",
      type: "number",
      group: "payment",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✓ Site settings created");

  // ============================================
  // 7. Create Pages (Legal & Info)
  // ============================================
  console.log("Creating pages...");

  const pages = [
    {
      title: "Gizlilik Politikası",
      slug: "gizlilik-politikasi",
      content: `<h2>Kişisel Verilerin Korunması</h2>
<p>Halikarnas Sandals olarak, müşterilerimizin gizliliğine büyük önem veriyoruz. Bu politika, kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklamaktadır.</p>

<h3>Toplanan Veriler</h3>
<p>Web sitemizi ziyaret ettiğinizde ve alışveriş yaptığınızda aşağıdaki bilgileri toplayabiliriz:</p>
<ul>
<li>Ad, soyad ve iletişim bilgileri</li>
<li>Teslimat ve fatura adresleri</li>
<li>E-posta adresi ve telefon numarası</li>
<li>Ödeme bilgileri (güvenli ödeme sağlayıcıları aracılığıyla)</li>
<li>Sipariş geçmişi ve tercihler</li>
</ul>

<h3>Verilerin Kullanımı</h3>
<p>Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:</p>
<ul>
<li>Siparişlerinizi işlemek ve teslim etmek</li>
<li>Müşteri hizmetleri sağlamak</li>
<li>Yasal yükümlülükleri yerine getirmek</li>
<li>İzniniz dahilinde pazarlama iletişimi göndermek</li>
</ul>

<h3>Veri Güvenliği</h3>
<p>Verileriniz, endüstri standardı güvenlik önlemleriyle korunmaktadır. SSL şifreleme kullanarak tüm veri transferlerini güvence altına alıyoruz.</p>

<h3>İletişim</h3>
<p>Gizlilik politikamız hakkında sorularınız için <a href="mailto:info@halikarnassandals.com">info@halikarnassandals.com</a> adresinden bize ulaşabilirsiniz.</p>`,
      metaTitle: "Gizlilik Politikası | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals gizlilik politikası ve kişisel verilerin korunması hakkında bilgi.",
      isActive: true,
    },
    {
      title: "Kullanım Koşulları",
      slug: "kullanim-kosullari",
      content: `<h2>Web Sitesi Kullanım Koşulları</h2>
<p>Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>

<h3>Genel Koşullar</h3>
<p>Halikarnas Sandals web sitesi ve içeriği, Türkiye Cumhuriyeti yasalarına tabidir. Web sitemizdeki tüm içerikler telif hakkı ile korunmaktadır.</p>

<h3>Ürün Bilgileri</h3>
<p>Web sitemizdeki ürün fotoğrafları ve açıklamaları bilgilendirme amaçlıdır. Gerçek ürünlerde küçük farklılıklar olabilir. Fiyatlar önceden haber verilmeksizin değiştirilebilir.</p>

<h3>Sipariş ve Ödeme</h3>
<p>Siparişiniz, ödeme onaylandıktan sonra işleme alınır. Stok durumuna göre sipariş iptal edilebilir ve ödemeniz iade edilir.</p>

<h3>Fikri Mülkiyet</h3>
<p>Web sitemizdeki tüm tasarımlar, logolar, içerikler ve ürün görselleri Halikarnas Sandals'a aittir. İzinsiz kullanılamaz.</p>

<h3>Sorumluluk Sınırı</h3>
<p>Web sitemizdeki bilgilerin doğruluğu için azami özeni gösteriyoruz, ancak olası hatalardan sorumlu tutulamayız.</p>`,
      metaTitle: "Kullanım Koşulları | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals web sitesi kullanım koşulları ve şartları.",
      isActive: true,
    },
    {
      title: "Çerez Politikası",
      slug: "cerez-politikasi",
      content: `<h2>Çerez (Cookie) Politikası</h2>
<p>Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanmaktadır.</p>

<h3>Çerez Nedir?</h3>
<p>Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, tercihlerinizi hatırlamamıza ve sitemizi daha iyi kullanmanızı sağlar.</p>

<h3>Kullandığımız Çerez Türleri</h3>
<ul>
<li><strong>Zorunlu Çerezler:</strong> Sitenin temel işlevleri için gereklidir (sepet, oturum yönetimi).</li>
<li><strong>Performans Çerezleri:</strong> Siteyi nasıl kullandığınızı anlamamıza yardımcı olur.</li>
<li><strong>İşlevsellik Çerezleri:</strong> Tercihlerinizi (dil, bölge) hatırlar.</li>
<li><strong>Pazarlama Çerezleri:</strong> Size ilgili reklamlar göstermek için kullanılır.</li>
</ul>

<h3>Çerez Yönetimi</h3>
<p>Tarayıcı ayarlarınızdan çerezleri kabul etmeyebilir veya silebilirsiniz. Ancak bu durumda bazı site özellikleri düzgün çalışmayabilir.</p>`,
      metaTitle: "Çerez Politikası | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals çerez (cookie) kullanımı hakkında bilgi.",
      isActive: true,
    },
    {
      title: "KVKK Aydınlatma Metni",
      slug: "kvkk",
      content: `<h2>Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni</h2>
<p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Halikarnas Sandals olarak veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında işlemekteyiz.</p>

<h3>Veri Sorumlusu</h3>
<p>Halikarnas Sandals Tic. Ltd. Şti.<br>Kumbahçe Mah. Neyzen Tevfik Cad. No:12<br>48400 Bodrum / Muğla</p>

<h3>İşlenen Kişisel Veriler</h3>
<ul>
<li>Kimlik bilgileri (ad, soyad, T.C. kimlik numarası)</li>
<li>İletişim bilgileri (adres, telefon, e-posta)</li>
<li>Finansal bilgiler (banka hesap bilgileri, fatura bilgileri)</li>
<li>Müşteri işlem bilgileri (sipariş geçmişi, tercihler)</li>
</ul>

<h3>İşleme Amaçları</h3>
<p>Kişisel verileriniz; sözleşmenin ifası, yasal yükümlülüklerin yerine getirilmesi, müşteri hizmetleri sağlanması ve izniniz dahilinde pazarlama faaliyetleri amacıyla işlenmektedir.</p>

<h3>Haklarınız</h3>
<p>KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını öğrenme, düzeltme veya silme talep etme haklarına sahipsiniz.</p>

<h3>Başvuru</h3>
<p>Haklarınızı kullanmak için <a href="mailto:kvkk@halikarnassandals.com">kvkk@halikarnassandals.com</a> adresine başvurabilirsiniz.</p>`,
      metaTitle: "KVKK Aydınlatma Metni | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals KVKK kapsamında kişisel verilerin işlenmesi hakkında aydınlatma metni.",
      isActive: true,
    },
    {
      title: "Kargo ve Teslimat",
      slug: "kargo-ve-teslimat",
      content: `<h2>Kargo ve Teslimat Bilgileri</h2>

<h3>Teslimat Süreleri</h3>
<p>Siparişleriniz, ödeme onayından sonra <strong>1-2 iş günü</strong> içinde hazırlanır ve kargoya verilir.</p>
<ul>
<li><strong>Büyük şehirler:</strong> 1-2 iş günü</li>
<li><strong>Diğer iller:</strong> 2-4 iş günü</li>
<li><strong>Uzak bölgeler:</strong> 3-5 iş günü</li>
</ul>

<h3>Kargo Ücreti</h3>
<table style="width:100%; border-collapse: collapse;">
<tr style="background:#f5f5f5;"><th style="padding:10px; border:1px solid #ddd;">Sipariş Tutarı</th><th style="padding:10px; border:1px solid #ddd;">Kargo Ücreti</th></tr>
<tr><td style="padding:10px; border:1px solid #ddd;">500 TL ve üzeri</td><td style="padding:10px; border:1px solid #ddd;"><strong>ÜCRETSİZ</strong></td></tr>
<tr><td style="padding:10px; border:1px solid #ddd;">500 TL altı</td><td style="padding:10px; border:1px solid #ddd;">29,90 TL</td></tr>
</table>

<h3>Kargo Firmaları</h3>
<p>Yurtiçi Kargo ve MNG Kargo ile çalışmaktayız. Sipariş sırasında tercih ettiğiniz kargo firmasını seçebilirsiniz.</p>

<h3>Sipariş Takibi</h3>
<p>Siparişiniz kargoya verildiğinde, kargo takip numaranız e-posta ile gönderilir. Hesabınızdan da siparişlerinizi takip edebilirsiniz.</p>`,
      metaTitle: "Kargo ve Teslimat | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals kargo ve teslimat süreleri, ücretleri hakkında bilgi.",
      isActive: true,
    },
    {
      title: "İade ve Değişim",
      slug: "iade-ve-degisim",
      content: `<h2>İade ve Değişim Politikası</h2>

<h3>İade Koşulları</h3>
<p>Ürünlerimizi <strong>teslim tarihinden itibaren 14 gün</strong> içinde iade edebilirsiniz.</p>
<ul>
<li>Ürün kullanılmamış olmalıdır</li>
<li>Orijinal ambalajında olmalıdır</li>
<li>Fatura ile birlikte gönderilmelidir</li>
<li>Hijyen bandı/etiketi çıkarılmamış olmalıdır</li>
</ul>

<h3>Beden Değişikliği</h3>
<p>Beden değişikliği için ürünü bize göndermeniz yeterlidir. Yeni bedeni <strong>ücretsiz</strong> olarak kargoluyoruz.</p>

<h3>Kargo Ücreti</h3>
<ul>
<li><strong>Beden değişikliği:</strong> Kargo ücretsiz</li>
<li><strong>Hatalı/hasarlı ürün:</strong> Kargo ücretsiz</li>
<li><strong>Fikir değişikliği:</strong> Kargo müşteriye aittir</li>
</ul>

<h3>İade Süreci</h3>
<ol>
<li>Müşteri hizmetlerimizle iletişime geçin</li>
<li>İade formunu doldurun</li>
<li>Ürünü orijinal ambalajında kargolayın</li>
<li>Ürün kontrolü sonrası 3-5 iş günü içinde iade yapılır</li>
</ol>

<h3>Para İadesi</h3>
<p>İade tutarı, aynı ödeme yöntemine aktarılır. Banka işlemleri ek 3-5 iş günü sürebilir.</p>`,
      metaTitle: "İade ve Değişim | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals iade ve değişim koşulları, süreci hakkında bilgi.",
      isActive: true,
    },
    {
      title: "Ödeme Seçenekleri",
      slug: "odeme-secenekleri",
      content: `<h2>Ödeme Seçenekleri</h2>

<h3>Kredi Kartı / Banka Kartı</h3>
<p>Visa, MasterCard ve Troy kartlarınızla güvenle ödeme yapabilirsiniz.</p>

<h3>Taksit Seçenekleri</h3>
<table style="width:100%; border-collapse: collapse;">
<tr style="background:#f5f5f5;"><th style="padding:10px; border:1px solid #ddd;">Taksit</th><th style="padding:10px; border:1px solid #ddd;">Aylık Ödeme</th></tr>
<tr><td style="padding:10px; border:1px solid #ddd;">3 Taksit</td><td style="padding:10px; border:1px solid #ddd;">Toplam / 3</td></tr>
<tr><td style="padding:10px; border:1px solid #ddd;">6 Taksit</td><td style="padding:10px; border:1px solid #ddd;">Toplam / 6</td></tr>
<tr><td style="padding:10px; border:1px solid #ddd;">9 Taksit</td><td style="padding:10px; border:1px solid #ddd;">Toplam / 9</td></tr>
<tr><td style="padding:10px; border:1px solid #ddd;">12 Taksit</td><td style="padding:10px; border:1px solid #ddd;">Toplam / 12</td></tr>
</table>
<p><em>Taksit seçenekleri banka ve kart tipine göre değişebilir.</em></p>

<h3>Havale / EFT</h3>
<p>Banka havalesi ile ödeme yapabilirsiniz. Havale bilgileri sipariş sonrası e-posta ile gönderilir.</p>

<h3>Kapıda Ödeme</h3>
<p>Kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz. Kapıda ödeme için ek 9,90 TL hizmet bedeli uygulanır.</p>

<h3>Güvenli Ödeme</h3>
<p>Tüm ödemeleriniz 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz sistemimizde saklanmaz.</p>`,
      metaTitle: "Ödeme Seçenekleri | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals ödeme yöntemleri ve taksit seçenekleri hakkında bilgi.",
      isActive: true,
    },
    {
      title: "Kariyer",
      slug: "kariyer",
      content: `<h2>Halikarnas Sandals'ta Kariyer</h2>

<p>Türkiye'nin önde gelen el yapımı sandalet markasında yerinizi alın!</p>

<h3>Neden Halikarnas Sandals?</h3>
<ul>
<li>Köklü zanaatkarlık geleneği</li>
<li>Dinamik ve yaratıcı çalışma ortamı</li>
<li>Kariyer gelişim fırsatları</li>
<li>Rekabetçi maaş ve yan haklar</li>
</ul>

<h3>Açık Pozisyonlar</h3>
<p>Şu an için açık pozisyonumuz bulunmamaktadır. Ancak özgeçmişinizi her zaman <a href="mailto:kariyer@halikarnassandals.com">kariyer@halikarnassandals.com</a> adresine gönderebilirsiniz.</p>

<h3>Staj Programı</h3>
<p>Üniversite öğrencileri için yaz stajı programımız hakkında bilgi almak için bizimle iletişime geçin.</p>`,
      metaTitle: "Kariyer | Halikarnas Sandals",
      metaDescription: "Halikarnas Sandals kariyer fırsatları ve açık pozisyonlar.",
      isActive: true,
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }
  console.log("✓ Pages created");

  // ============================================
  // Summary
  // ============================================
  const productCount = await prisma.product.count();
  const variantCount = await prisma.productVariant.count();
  const categoryCount = await prisma.category.count();
  const collectionCount = await prisma.collection.count();
  const pageCount = await prisma.page.count();
  const faqCount = await prisma.fAQ.count();

  console.log("\n✅ Seeding completed!");
  console.log(`   - ${categoryCount} categories`);
  console.log(`   - ${collectionCount} collections`);
  console.log(`   - ${productCount} products`);
  console.log(`   - ${variantCount} variants`);
  console.log(`   - ${pageCount} pages`);
  console.log(`   - ${faqCount} FAQs`);
  console.log(`   - Admin: admin@halikarnassandals.com / Admin123!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
