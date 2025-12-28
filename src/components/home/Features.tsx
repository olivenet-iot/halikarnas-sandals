"use client";

import { motion } from "framer-motion";
import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Ücretsiz Kargo",
    description: "500 TL ve üzeri siparişlerde",
  },
  {
    icon: RefreshCcw,
    title: "15 Gün İade",
    description: "Koşulsuz iade garantisi",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Ödeme",
    description: "256-bit SSL şifreleme",
  },
  {
    icon: Headphones,
    title: "7/24 Destek",
    description: "Her zaman yanınızdayız",
  },
];

export function Features() {
  return (
    <section className="py-8 md:py-10 bg-leather-800">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 md:gap-4"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-sand-100/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-sand-200" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-sand-400 hidden sm:block">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
