import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";
import Hero from "#/components/sections/Hero";
import { useIsMobile } from "#/hooks/useMobile";

interface PageBannerProps {
  hero: Banner[];
  top: Banner[];
}

export function PageBanner({ hero, top }: PageBannerProps) {
  const { isMobile } = useIsMobile();
  return (
    <>
      <Hero banners={hero} />
      <BannerCarousel
        banners={top}
        height={isMobile ? "92vh" : "72vh"}
        className={`-mx-6 md:-mx-16 ${hero.length === 0 ? "pt-[78px]" : ""}`}
      />
    </>
  );
}
