import Image from "next/image";
import Link from "next/link";

export function AtelierTeaser() {
  return (
    <section className="bg-v2-bg-primary">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12 lg:items-stretch">
        {/* Left — full-bleed image */}
        <div className="relative aspect-[4/5] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[640px]">
          {/* TODO: photo — atölye teaser için ayrı bir fotoğraf seçilecek, manuel değiştirilecek */}
          <Image
            src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1775908391/halikarnas/home/DSC08111_2_c23tu3.webp"
            alt="Halikarnas atölyesi"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        </div>

        {/* Right — text block, vertical center */}
        <div className="flex items-center px-6 py-16 lg:col-span-5 lg:px-20 lg:py-0">
          <div className="max-w-md">
            <span className="font-inter text-[11px] uppercase tracking-[0.2em] text-v2-text-muted">
              Atölye
            </span>
            {/* TODO: copy — başlık placeholder, manuel değiştirilecek */}
            <h2 className="mt-6 font-serif font-light text-4xl lg:text-5xl text-v2-text-primary leading-[1.1]">
              Bodrum&apos;da, elle
            </h2>
            {/* TODO: copy — gövde placeholder, manuel değiştirilecek */}
            <p className="mt-8 font-inter text-base text-v2-text-muted leading-relaxed">
              Her sandalet hammaddeden son dikişe kadar aynı ellerden geçer.
              Seri üretim yok; her çift, sahibine özel bir zamanda tamamlanır.
            </p>

            <Link href="/hikayemiz" className="group inline-block mt-10">
              <span className="block font-inter text-[11px] uppercase tracking-[0.2em] text-v2-text-primary">
                Hikayemiz →
              </span>
              <span
                aria-hidden
                className="block h-px w-12 bg-v2-text-primary/40 mt-3 transition-all duration-500 ease-out group-hover:w-16 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
