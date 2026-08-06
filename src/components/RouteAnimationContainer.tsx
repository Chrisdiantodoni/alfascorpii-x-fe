// src/components/route-animation-container.tsx
import { useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

interface RouteAnimationContainerProps {
  children: ReactNode;
}

export function RouteAnimationContainer({
  children,
}: RouteAnimationContainerProps) {
  const router = useRouter();

  return (
    <AnimatePresence
      mode="popLayout"
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div key={router.state.location.pathname}>{children}</motion.div>
    </AnimatePresence>
  );
}
