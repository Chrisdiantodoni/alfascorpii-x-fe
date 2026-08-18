import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";

export default function Hero({ banners }: { banners: Banner[] }) {
	return (
		<BannerCarousel
			banners={banners}
			heightClass="h-[70svh] md:h-[85dvh] lg:h-[92dvh]"
			autoRotate={5000}
			className="-mx-6 md:-mx-16"
		/>
	);
}
