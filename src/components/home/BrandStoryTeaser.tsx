export function BrandStoryTeaser() {
  return (
    <section className="section-v2 container-v2">
      <div className="max-w-full md:max-w-[50%]">
        {/* Label — sole exception eyelash for section identification */}
        <span className="font-inter text-v2-label uppercase text-v2-text-muted block mb-6">
          Hikaye
        </span>

        {/* Heading */}
        <h2 className="font-serif font-light text-2xl md:text-3xl text-v2-text-primary mb-8">
          Zanaatın Sesi
        </h2>

        {/* Body — max 60ch, line-height 1.7 */}
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

        {/* No link — /hakkimizda redesign pending, link will be added then */}
      </div>
    </section>
  );
}
