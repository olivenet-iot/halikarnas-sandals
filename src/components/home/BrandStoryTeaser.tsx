import Image from "next/image";

export function BrandStoryTeaser() {
  return (
    <section className="section-v2 container-v2">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left column — text */}
        <div className="md:col-span-5">
          {/* Label */}
          <span className="font-inter text-v2-label uppercase text-v2-accent block mb-6">
            Hikaye
          </span>

          {/* Heading */}
          <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary mb-8">
            Zanaatın Sesi
          </h2>

          {/* Body */}
          <div className="font-inter text-v2-body text-v2-text-muted max-w-[60ch] space-y-4">
            <p>
              Halikarnas — bugünkü Bodrum — binlerce yıldır Akdeniz&apos;in
              kavşağında duran bir liman şehri. Burada dericilik sadece bir zanaat
              değil, toprağın ve denizin ritmini ayaklara taşıyan bir gelenek. Biz
              de bu geleneğin çağdaş sesi olmaya çalışıyoruz.
            </p>
            <p>
              Atölyemizde her sandalet, hammaddeden son dikişe kadar aynı ellerde
              şekilleniyor. Seri üretim yapmıyoruz; her çift, sahibine özel bir
              zamanda, özenle tamamlanıyor. Bu yavaşlık bizim için bir tercih —
              hızlı moda değil, kalıcı zanaat.
            </p>
          </div>
        </div>

        {/* Right column — detail image */}
        <div className="hidden md:block md:col-span-6 md:col-start-7">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=80"
              alt="Deri işçiliği detayı"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 0px, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
