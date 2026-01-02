"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

interface LuxuryFAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE.luxury,
      delay: index * 0.1,
    },
  }),
};

export function LuxuryFAQAccordion({ items, className }: LuxuryFAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <AccordionItem
            value={`item-${index}`}
            className="border-0 border-b border-stone-200 py-1"
          >
            <AccordionTrigger
              className={cn(
                "text-left py-5 hover:no-underline group",
                "text-stone-800 font-normal text-base",
                "data-[state=open]:text-[#B8860B]",
                "[&>svg]:hidden" // Hide default chevron
              )}
            >
              <span className="flex-1 pr-4 transition-colors duration-300 group-hover:text-[#B8860B]">
                {item.q}
              </span>
              <motion.span
                className="flex-shrink-0 w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center
                           group-hover:border-[#B8860B]/50 group-data-[state=open]:border-[#B8860B] group-data-[state=open]:bg-[#B8860B]/5
                           transition-all duration-300"
              >
                <ChevronDown className="h-4 w-4 text-stone-400 transition-all duration-300
                                        group-hover:text-[#B8860B] group-data-[state=open]:text-[#B8860B]
                                        group-data-[state=open]:rotate-180" />
              </motion.span>
            </AccordionTrigger>
            <AccordionContent className="text-stone-600 leading-relaxed pb-6 pr-12">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}

export default LuxuryFAQAccordion;
