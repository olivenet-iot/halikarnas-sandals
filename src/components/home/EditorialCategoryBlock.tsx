import Image from "next/image";
import Link from "next/link";

export function EditorialCategoryBlock() {
  return (
    <section className="section-v2 container-v2">
      <div className="grid grid-cols-1 md:grid-cols-[65fr_35fr] gap-4 md:gap-6">
        {/* Left — Women (large) */}
        <div>
          <Link href="/kadin" className="group block">
            <div className="relative h-[400px] md:h-[650px] overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766897985/halikarnas/home/kadin-koleksiyonu_l0rkzo.webp"
                alt="Kadın sandaletleri"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 65vw"
              />
            </div>
            <span className="inline-block mt-4 font-inter text-v2-label uppercase text-v2-text-muted link-underline-v2">
              Kadın
            </span>
          </Link>
        </div>

        {/* Right — Men (smaller) + Typography */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Men image (top ~55%) */}
          <Link href="/erkek" className="group block">
            <div className="relative h-[300px] md:h-[55%] min-h-[280px] overflow-hidden">
              <Image
                src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1775908098/halikarnas/home/erkek1_vki4pb.webp"
                alt="Erkek sandaletleri"
                fill
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 35vw"
              />
            </div>
            <span className="inline-block mt-4 font-inter text-v2-label uppercase text-v2-text-muted link-underline-v2">
              Erkek
            </span>
          </Link>

          {/* Typography block (bottom) */}
          <div className="flex items-end flex-1 pb-4">
            <h2 className="font-serif font-light text-2xl md:text-3xl lg:text-4xl text-v2-text-primary leading-[1.2]">
              Farklı Yollar,
              <br />
              Aynı Ustalık
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
