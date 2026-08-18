import Hero from "#/components/sections/Hero";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";

interface PageBannerProps {
  hero: Banner[];
  top: Banner[];
}

export function PageBanner({ hero, top }: PageBannerProps) {
  return (
    <>
      <Hero banners={hero} />
      <BannerCarousel
        banners={top}
        heightClass="h-[50svh] md:h-[60dvh] lg:h-[92dvh]"
        className={`-mx-6 md:-mx-16 ${hero.length === 0 ? "pt-[78px]" : ""}`}
      />
    </>
  );
}
