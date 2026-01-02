"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { GoldDivider } from "@/components/ui/luxury/GoldDivider";
import { MagneticButton } from "@/components/ui/luxury/MagneticButton";
import { EASE } from "@/lib/animations";

export function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE.luxury }}
      className="text-center py-24"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: EASE.luxury }}
        className="w-24 h-24 mx-auto mb-8 rounded-full bg-stone-100 flex items-center justify-center"
      >
        <ShoppingBag className="h-10 w-10 text-stone-400" />
      </motion.div>

      <GoldDivider variant="default" className="mx-auto mb-8" />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-serif text-2xl text-stone-800 mb-4"
      >
        Sepetiniz Bos
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-stone-600 max-w-md mx-auto mb-10"
      >
        Henuz sepetinize urun eklemediniz. Koleksiyonlarimizi kesfederek el yapimi hakiki deri sandaletlerimizi inceleyin.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <MagneticButton
          href="/koleksiyonlar"
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Koleksiyonlari Kesfet
        </MagneticButton>
      </motion.div>
    </motion.div>
  );
}
