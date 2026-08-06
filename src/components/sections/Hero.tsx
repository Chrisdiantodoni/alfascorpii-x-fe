import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";

export default function Hero({ banners }: { banners: Banner[] }) {
  return (
    <BannerCarousel
      banners={banners}
      height="92vh"
      autoRotate={5000}
      className="-mx-6 md:-mx-16"
    />
  );
}
