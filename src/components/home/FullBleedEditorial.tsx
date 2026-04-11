import Image from "next/image";

export function FullBleedEditorial() {
  return (
    <section className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
      {/* TODO: GERÇEK GÖRSEL — PLACEHOLDER_editorial-atelier.jpg dosyasını grep'leyip değiştirin */}
      <Image
        src="/images/placeholder/PLACEHOLDER_editorial-atelier.jpg"
        alt="Halikarnas atölyesi"
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Single line overlay text — bottom-left */}
      <p
        className="absolute bottom-6 left-6 md:bottom-12 md:left-16 font-serif font-light text-lg md:text-xl text-white"
        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.35)" }}
      >
        Her dikiş, bir usta eli.
      </p>
    </section>
  );
}
