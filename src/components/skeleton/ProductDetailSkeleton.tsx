// components/ui/ProductDetailSkeleton.tsx
import { motion } from "motion/react";
import { MaterialIcon } from "../ui/MaterialIcon";
import { useParams } from "@tanstack/react-router";

export function ProductDetailSkeleton() {
  return (
    <>
      {/* Back button skeleton */}
      <section className="pt-32 pb-8">
        <div className="inline-flex items-center gap-2 text-[11px] tracking-widest text-ash">
          <MaterialIcon name="arrow_back" className="!text-[16px]" />
          KEMBALI
        </div>
      </section>

      <section className="pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image skeleton */}
        <motion.div
          className="aspect-square bg-paper-dim overflow-hidden mb-5 rounded-sm"
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="w-full h-full bg-gradient-to-br from-paper-dim via-paper to-paper-dim animate-pulse" />
        </motion.div>

        {/* Content skeleton */}
        <div className="space-y-6">
          {/* Sub category skeleton */}
          <div className="h-4 w-24 bg-paper-dim rounded animate-pulse" />

          {/* Title and wishlist skeleton */}
          <div className="flex items-start justify-between gap-4">
            <div className="h-10 w-3/4 bg-paper-dim rounded animate-pulse" />
            <div className="h-10 w-10 bg-paper-dim rounded-full shrink-0 animate-pulse" />
          </div>

          {/* Code skeleton */}
          <div className="h-4 w-32 bg-paper-dim rounded animate-pulse" />

          {/* Price skeleton */}
          <div className="h-8 w-48 bg-paper-dim rounded animate-pulse" />

          {/* Description skeleton */}
          <div className="space-y-2 max-w-lg">
            <div className="h-4 w-full bg-paper-dim rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-paper-dim rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-paper-dim rounded animate-pulse" />
          </div>

          {/* Color picker skeleton */}
          <div className="space-y-3">
            <div className="h-3 w-32 bg-paper-dim rounded animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-paper-dim animate-pulse"
                />
              ))}
            </div>
            <div className="h-4 w-24 bg-paper-dim rounded animate-pulse" />
          </div>

          {/* Stock skeleton */}
          <div className="h-4 w-36 bg-paper-dim rounded animate-pulse" />

          {/* Button skeleton */}
          <div className="h-12 w-full sm:w-48 bg-paper-dim rounded animate-pulse" />

          {/* Specifications skeleton */}
          <div className="mt-8 space-y-3">
            <div className="h-3 w-24 bg-paper-dim rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-line"
                >
                  <div className="h-4 w-24 bg-paper-dim rounded animate-pulse" />
                  <div className="h-4 w-32 bg-paper-dim rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
