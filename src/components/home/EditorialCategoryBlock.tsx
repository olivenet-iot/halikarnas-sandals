import Image from "next/image";
import Link from "next/link";

export function EditorialCategoryBlock() {
  return (
    <section className="section-v2 container-v2">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
        {/* Women — left, no offset */}
        <Link href="/kadin" className="group block lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[620px]">
            <Image
              src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1766897985/halikarnas/home/kadin-koleksiyonu_l0rkzo.webp"
              alt="Kadın sandaletleri"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </div>
          <div className="mt-6">
            <h3 className="font-serif font-light text-2xl lg:text-3xl text-v2-text-primary">
              Kadın
            </h3>
            <span className="mt-2 inline-block font-inter text-[11px] uppercase tracking-[0.2em] text-v2-text-muted">
              Koleksiyonu Gör →
            </span>
          </div>
        </Link>

        {/* Men — right, asymmetric offset */}
        <Link
          href="/erkek"
          className="group block lg:col-span-4 lg:col-start-9 lg:mt-32"
        >
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[440px]">
            <Image
              src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1775908098/halikarnas/home/erkek1_vki4pb.webp"
              alt="Erkek sandaletleri"
              fill
              className="object-cover object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
          <div className="mt-6">
            <h3 className="font-serif font-light text-2xl lg:text-3xl text-v2-text-primary">
              Erkek
            </h3>
            <span className="mt-2 inline-block font-inter text-[11px] uppercase tracking-[0.2em] text-v2-text-muted">
              Koleksiyonu Gör →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
