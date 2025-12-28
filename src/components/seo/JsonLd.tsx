const BASE_URL = process.env.NEXTAUTH_URL || "https://halikarnassandals.com";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Halikarnas Sandals",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Bodrum'un antik mirası Halikarnas'tan ilham alan, hakiki deriden el yapımı premium sandaletler.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kumbahçe Mah. Atatürk Cad. No:45",
      addressLocality: "Bodrum",
      addressRegion: "Muğla",
      postalCode: "48400",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-252-316-1234",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    sameAs: [
      "https://www.instagram.com/halikarnassandals",
      "https://www.facebook.com/halikarnassandals",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  product: {
    name: string;
    description: string;
    slug: string;
    images: { url: string }[];
    basePrice: number;
    salePrice?: number | null;
    variants: { stock: number }[];
    rating?: number;
    reviewCount?: number;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const price = product.salePrice || product.basePrice;
  const inStock = product.variants.some((v) => v.stock > 0);

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.url),
    brand: {
      "@type": "Brand",
      name: "Halikarnas Sandals",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/urun/${product.slug}`,
      priceCurrency: "TRY",
      price: price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Halikarnas Sandals",
      },
    },
    ...(product.reviewCount && product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating || 5,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface FAQJsonLdProps {
  faqs: { question: string; answer: string }[];
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface WebsiteJsonLdProps {
  searchUrl?: string;
}

export function WebsiteJsonLd({ searchUrl }: WebsiteJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Halikarnas Sandals",
    url: BASE_URL,
    description:
      "Bodrum'un antik mirası Halikarnas'tan ilham alan, hakiki deriden el yapımı premium sandaletler.",
    potentialAction: searchUrl
      ? {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}${searchUrl}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface LocalBusinessJsonLdProps {
  name?: string;
  image?: string;
}

export function LocalBusinessJsonLd({ name, image }: LocalBusinessJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ShoeStore",
    name: name || "Halikarnas Sandals",
    image: image || `${BASE_URL}/storefront.jpg`,
    "@id": BASE_URL,
    url: BASE_URL,
    telephone: "+90-252-316-1234",
    priceRange: "₺₺",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kumbahçe Mah. Atatürk Cad. No:45",
      addressLocality: "Bodrum",
      addressRegion: "Muğla",
      postalCode: "48400",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.0344,
      longitude: 27.4305,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/halikarnassandals",
      "https://www.facebook.com/halikarnassandals",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
