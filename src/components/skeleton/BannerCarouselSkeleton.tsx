// components/ui/BannerCarouselSkeleton.tsx
import { motion } from "motion/react";

export function BannerCarouselSkeleton() {
  return (
    <div className="relative w-full overflow-hidden -mx-6 md:-mx-16">
      <div className="aspect-[16/6] md:aspect-[16/5] bg-paper-dim animate-pulse rounded-lg">
        <div className="w-full h-full bg-gradient-to-r from-paper-dim via-paper to-paper-dim animate-shimmer" />
      </div>
    </div>
  );
}
