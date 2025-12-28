"use client";

import { motion } from "framer-motion";

const promises = [
  { text: "Hakiki Deri", subtext: "İtalyan Tabakhanelerinden" },
  { text: "El Yapımı", subtext: "Usta Zanaatkarlık" },
  { text: "Bodrum", subtext: "Halikarnas Mirası" },
  { text: "Ücretsiz Kargo", subtext: "500₺ Üzeri" },
];

export function BrandPromise() {
  return (
    <section className="relative bg-luxury-primary py-5 overflow-hidden">
      <div className="container-luxury relative">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-24">
          {promises.map((promise, index) => (
            <motion.div
              key={promise.text}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <span className="text-luxury-gold text-xs tracking-[0.25em] uppercase font-medium">
                {promise.text}
              </span>
              <span className="text-luxury-cream/60 text-[10px] tracking-wider mt-0.5 hidden md:block">
                {promise.subtext}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
