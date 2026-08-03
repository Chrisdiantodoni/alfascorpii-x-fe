import { createFileRoute } from "@tanstack/react-router";
import Faq from "#/components/sections/Faq";
import FeaturedCarousel from "#/components/sections/FeaturedCarousel";
import Hero from "#/components/sections/Hero";
import InquiryForm from "#/components/sections/InquiryForm";
import MessageGallery from "#/components/sections/MessageGallery";
import Partners from "#/components/sections/Partners";
import SocialsGrid from "#/components/sections/SocialsGrid";
import SplitSection from "#/components/sections/SplitSection";
import UspStrip from "#/components/sections/UspStrip";
import VideoSection from "#/components/sections/VideoSection";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";
import { getBanners } from "#/server/cms";
import { getCategories, getSiteSettings } from "#/server/master";
import { getSocialFeeds } from "#/server/socials";

export const Route = createFileRoute("/_public/")({
	component: Home,
	loader: async ({ location }) => {
		const [banners, { settings }, { categories }, socials] = await Promise.all([
			getBanners({ data: { pathname: location.pathname } }),
			getSiteSettings({ data: { key: "faqs" } }),
			getCategories(),
			getSocialFeeds(),
		]);
		return {
			banners,
			faqs: settings,
			categories,
			socials,
		};
	},
});

function Home() {
	const { banners, faqs, categories, socials } = Route.useLoaderData();
	return (
		<>
			<Hero banners={banners.hero as Banner[]} />
			<BannerCarousel
				banners={banners.top as Banner[]}
				height="250px"
				className="-mx-6 md:-mx-16"
			/>
			<UspStrip />
			<MessageGallery />
			<SplitSection categories={categories} />
			<BannerCarousel
				banners={banners.middle as Banner[]}
				height="350px"
				className="-mx-6 md:-mx-16"
			/>
			<FeaturedCarousel
				title="Line-up Terpilih"
				description="Dari matic premium sampai motor sport — arahkan kursor untuk menggeser."
				ctaText="LIHAT SEMUA"
				ctaVariant="link"
				categorySlug="sepeda-motor"
				categories={categories}
				cardMode="motor"
			/>

			<FeaturedCarousel
				label="ALFA SCORPII SPAREPARTS"
				title="Genuine Parts, Performa Original."
				description="Yamalube, Yamaha Genuine Parts, Dunlop dan Philips — diskon 10% untuk semua sparepart original selama periode promo."
				ctaText="LIHAT SEMUA"
				ctaVariant="link"
				categorySlug="sparepart"
				categories={categories}
				cardMode="sparepart"
			/>
			<Partners />
			<SocialsGrid socials={socials} />
			<VideoSection />
			<BannerCarousel
				banners={banners.bottom as Banner[]}
				height="200px"
				className="-mx-6 md:-mx-16"
			/>
			<InquiryForm />
			<Faq faqs={faqs} />
		</>
	);
}
