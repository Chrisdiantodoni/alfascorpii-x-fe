import { useId, type ReactNode } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "motion/react";
import { MaterialIcon } from "#/components/ui/MaterialIcon";

import "swiper/css";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface SwiperContainerProps {
  children: ReactNode[];
  className?: string;
  stagger?: boolean;
  showNavigation?: boolean;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  breakpoints?: Record<
    number,
    { slidesPerView: number; spaceBetween?: number }
  >;
}

export function SwiperContainer({
  children,
  className = "",
  stagger = false,
  showNavigation = true,
  slidesPerView = "auto",
  spaceBetween = 24,
  breakpoints,
}: SwiperContainerProps) {
  // Generate ID unik agar selector navigasi tidak bentrok jika Swiper dipasang lebih dari satu
  const rawId = useId();
  const uniqueId = rawId.replace(/:/g, "");
  const prevBtnClass = `swiper-prev-${uniqueId}`;
  const nextBtnClass = `swiper-next-${uniqueId}`;

  if (!children || children.length === 0) return null;

  const ContainerTag = stagger ? motion.div : "div";
  const containerMotionProps = stagger
    ? {
        variants: listVariants,
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, margin: "-32px" },
      }
    : {};

  return (
    <ContainerTag
      {...containerMotionProps}
      className={`relative group ${className}`}
    >
      <Swiper
        modules={[Navigation]}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        observer={true}
        onSwiper={(swiper) => swiper.update()}
        resizeObserver={true}
        observeParents={true}
        breakpoints={
          breakpoints || {
            0: { slidesPerView: 1.2, spaceBetween: 16 },
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            768: { slidesPerView: 3.2, spaceBetween: 24 },
            1024: { slidesPerView: 4.2, spaceBetween: 24 },
          }
        }
        navigation={{
          prevEl: `.${prevBtnClass}`,
          nextEl: `.${nextBtnClass}`,
        }}
        className="w-full !py-6 !-my-6 cursor-grab active:cursor-grabbing select-none"
      >
        {children.map((child, index) => (
          <SwiperSlide key={index} className="!h-auto">
            {stagger ? (
              <motion.div variants={itemVariants} className="h-full">
                {child}
              </motion.div>
            ) : (
              child
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      {showNavigation && children.length > 1 && (
        <>
          <button
            type="button"
            className={`${prevBtnClass} absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none`}
            aria-label="Previous slide"
          >
            <MaterialIcon name="arrow_back" className="!text-[22px]" />
          </button>
          <button
            type="button"
            className={`${nextBtnClass} absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none`}
            aria-label="Next slide"
          >
            <MaterialIcon name="arrow_forward" className="!text-[22px]" />
          </button>
        </>
      )}
    </ContainerTag>
  );
}
