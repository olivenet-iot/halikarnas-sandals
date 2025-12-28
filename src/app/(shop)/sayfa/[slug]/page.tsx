import { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { db } from "@/lib/db";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await db.page.findUnique({
    where: { slug, isActive: true },
  });

  if (!page) {
    return { title: "Sayfa Bulunamadı" };
  }

  return {
    title: page.metaTitle || `${page.title} | Halikarnas Sandals`,
    description: page.metaDescription || page.title,
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await db.page.findUnique({
    where: { slug, isActive: true },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8 pb-8 border-b">
          <h1 className="text-3xl md:text-4xl font-bold text-leather-900 mb-4">
            {page.title}
          </h1>
          <p className="text-sm text-leather-500">
            Son güncelleme:{" "}
            {format(new Date(page.updatedAt), "d MMMM yyyy", { locale: tr })}
          </p>
        </header>

        <div
          className="prose prose-lg max-w-none prose-headings:text-leather-900 prose-p:text-leather-700 prose-a:text-aegean-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-leather-900 prose-ul:text-leather-700 prose-ol:text-leather-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}
