import Image from "next/image";
import Link from "next/link";

export function BrandStoryTeaser() {
  return (
    <section className="section-v2 container-v2">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left column — text */}
        <div className="md:col-span-5">
          <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary mb-8">
            Zanaatın Sesi
          </h2>

          <div className="font-inter text-v2-body text-v2-text-muted max-w-[60ch] space-y-6">
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

          <Link href="/hikayemiz" className="group inline-block mt-8 lg:mt-10">
            <span className="block font-inter text-[11px] uppercase tracking-[0.2em] text-v2-text-primary">
              Hikayenin Tamamı →
            </span>
            <span
              aria-hidden
              className="block h-px w-12 bg-v2-text-primary/40 mt-3 transition-all duration-500 ease-out group-hover:w-16 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {/* Right column — detail image */}
        <div className="hidden md:block md:col-span-6 md:col-start-7">
          <div className="relative aspect-[4/5] overflow-hidden">
            {/* TODO: photo — AtelierTeaser ile aynı fotoğraf; farklı bir detay fotoğrafı seçilecek */}
            <Image
              src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1775908391/halikarnas/home/DSC08111_2_c23tu3.webp"
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
