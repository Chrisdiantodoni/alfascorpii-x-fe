import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import Faq from "#/components/sections/Faq";
import FeaturedCarousel from "#/components/sections/FeaturedCarousel";
import InquiryForm from "#/components/sections/InquiryForm";
import MessageGallery from "#/components/sections/MessageGallery";
import Partners from "#/components/sections/Partners";
import SocialsGrid from "#/components/sections/SocialsGrid";
import SplitSection from "#/components/sections/SplitSection";
import UspStrip from "#/components/sections/UspStrip";
import { PageBanner } from "#/components/PageBanner";
import VideoSection from "#/components/sections/VideoSection";
import type { Banner } from "#/components/ui/BannerSlide";
import { SkeletonGrid } from "#/components/ui/Skeleton";
import { getBanners } from "#/server/cms";
import { getCategories, getSiteSettings } from "#/server/master";
import { getSocialFeeds } from "#/server/socials";
import { BannerCarousel } from "#/components/ui/BannerCarousel";

export const Route = createFileRoute("/_public/")({
  component: Home,
  loader: async ({ location }) => {
    const [banners, { settings }, { categories }] = await Promise.all([
      getBanners({ data: { pathname: location.pathname } }),
      getSiteSettings({ data: { key: "faqs" } }),
      getCategories(),
    ]);
    return {
      banners,
      faqs: settings,
      categories,
    };
  },
});

function Home() {
  const { banners, faqs, categories } = Route.useLoaderData();

  return (
    <>
      <PageBanner
        hero={banners.hero as Banner[]}
        top={banners.top as Banner[]}
      />
      <UspStrip />
      <MessageGallery />
      <SplitSection categories={categories} />
      <BannerCarousel
        banners={banners.middle as Banner[]}
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
      <Suspense fallback={<SkeletonGrid cols={3} itemHeight={320} />}>
        <SocialsSection />
      </Suspense>
      <VideoSection />
      <BannerCarousel
        banners={banners.bottom as Banner[]}
        className="-mx-6 md:-mx-16"
      />
      <InquiryForm />
      {faqs && <Faq faqs={faqs} />}
    </>
  );
}

function SocialsSection() {
  const { data: socials } = useSuspenseQuery({
    queryKey: ["social-feeds"],
    queryFn: () => getSocialFeeds(),
    staleTime: 5 * 60 * 1000,
  });
  return <SocialsGrid socials={socials} />;
}
