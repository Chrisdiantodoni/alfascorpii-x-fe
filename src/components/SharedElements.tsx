import type { ReactNode } from "react";
import { motion } from "motion/react";

interface SharedElementProps {
  layoutId: string | undefined;
  children: ReactNode;
  className?: string;
  transition?: TransitionEvent;
}

export function SharedElement({
  layoutId,
  children,
  className,
  transition,
}: SharedElementProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      transition={{
        ...transition,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
}
