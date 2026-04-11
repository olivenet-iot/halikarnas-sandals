import Image from "next/image";

export function FullBleedEditorial() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] overflow-hidden">
      <Image
        src="https://res.cloudinary.com/dxqmfpa8g/image/upload/v1775908391/halikarnas/home/DSC08111_2_c23tu3.webp"
        alt="Halikarnas atölyesi"
        fill
        className="object-cover object-[center_75%]"
        sizes="100vw"
      />

      {/* Centered statement text */}
      <p className="absolute inset-0 flex items-center justify-center font-serif italic font-light text-3xl md:text-5xl lg:text-6xl text-white/90">
        Her dikiş, bir usta eli.
      </p>
    </section>
  );
}
