import { cn } from "#/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  animate?: boolean;
}

export function Section({
  children,
  className = "",
  id,
  animate,
}: SectionProps) {
  const Tag = animate ? motion.section : "section";
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-64px" },
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
      }
    : {};

  return (
    <Tag
      id={id}
      className={cn("py-24 border-t border-line scroll-mt-24", className)}
      {...motionProps}
    >
      {children}
    </Tag>
  );
}
