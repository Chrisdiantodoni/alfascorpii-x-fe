import { AnimatedRoute } from "#/components/AnimatedRoute";
import { PageBanner } from "#/components/PageBanner";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import { MarkdownPreview } from "#/components/ui/MarkdownPreview";
import { getBanners, getPages } from "#/server/cms";
import type { BannerProps, IPage } from "#/types";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/_public/$slug/")({
  component: RouteComponent,
  loader: async ({ location }) => {
    const [pages, banners] = await Promise.all([
      getPages({ data: { slug: location.pathname } }),
      getBanners({ data: { pathname: location.pathname } }),
    ]);
    if (!pages) throw notFound();
    return { pages, banners };
  },
});

function RouteComponent() {
  const { pages, banners }: { pages: IPage; banners: BannerProps } =
    Route.useLoaderData();

  return (
    <AnimatedRoute variant="slide">
      <PageBanner hero={banners.hero} top={banners.top} />
      <section className="min-h-[20vh] flex flex-col justify-center pt-36 pb-8 max-w-4xl mx-auto w-full px-4">
        <span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-4">
          HALAMAN
        </span>
        <h1 className="font-head font-black leading-[0.88] tracking-tighter text-[clamp(2.75rem,10vw,6rem)]">
          {pages.title}
        </h1>
        {pages.description && (
          <p className="text-[17px] md:text-[20px] text-ash max-w-lg mt-6">
            {pages.description}
          </p>
        )}
      </section>
      <BannerCarousel banners={banners.middle} className="-mx-6 md:-mx-16" />

      {/* Batasi lebar container di section content agar border tidak melebar liar */}
      <section className="max-w-4xl mx-auto w-full px-4 pt-8 pb-16 border-t border-line">
        <MarkdownPreview content={pages.content} />
      </section>
      <BannerCarousel banners={banners.bottom} className="-mx-6 md:-mx-16" />
    </AnimatedRoute>
  );
}
