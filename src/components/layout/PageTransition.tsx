// #/components/layout/PageTransition.tsx
import { motion } from "motion/react";
import type { ReactNode } from "react";

export const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  // exit: { opacity: 0, y: -15 },
  transition: { duration: 0.3, ease: "easeInOut" as const },
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      // exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}
