import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageBanner } from "#/components/PageBanner";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";
import { DragScrollContainer } from "#/components/ui/DragScrollContainer";
import { EmptyState } from "#/components/ui/EmptyState";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { SearchBar } from "#/components/ui/SearchBar";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { StaggerItem } from "#/components/ui/StaggerItem";
import { getBanners } from "#/server/cms";
import { getSubCategories, searchProducts } from "#/server/master";
import { formatRupiah } from "#/utils/fn";
import { SharedElement } from "#/components/SharedElements";
import { AnimatedRoute } from "#/components/AnimatedRoute";
import type { Category, SubCategory } from "#/types";
import { Image } from "#/components/ui/Image";
import { Button } from "#/components/ui/Button";

export const Route = createFileRoute("/_public/store/")({
  component: Store,
  loader: async ({ location }) => {
    const [banners, subCategories] = await Promise.all([
      getBanners({ data: { pathname: location.pathname } }),
      getSubCategories(),
    ]);
    return {
      banners,
      subCategories,
    };
  },
});

function SubCategoryBanner({ subCategory }: { subCategory: SubCategory }) {
  const thumbnail = subCategory.files?.find((f) => f.role === "thumbnail");

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-line/40 bg-ink-2 min-h-[240px] md:min-h-[360px] group">
      {/* Background Image - conditional render */}
      {thumbnail?.url && (
        <Image
          src={thumbnail.url}
          alt={subCategory.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          priority={false}
        />
      )}

      {/* Fallback watermark (motif BannerSlide) saat tidak ada thumbnail */}
      {!thumbnail?.url && (
        <div className="absolute inset-y-0 right-0 w-[60%] flex items-center justify-end opacity-[0.05] pr-0 lg:pr-10 pointer-events-none">
          <svg
            viewBox="0 0 400 240"
            className="w-full max-w-[900px]"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="90" cy="180" r="46" />
            <circle cx="310" cy="180" r="46" />
            <path d="M90 180 L168 88 H244 L310 180" strokeLinejoin="round" />
            <path d="M168 88 L140 180" />
            <path d="M244 88 L226 44 H272" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Gradient Overlay - brand ink, konsisten dengan BannerSlide */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/5" />

      {/* Accent Line - brand biru */}
      {/*<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-bright via-blue to-transparent" />*/}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl">
          <span className="text-[10px] tracking-[0.25em] text-blue-bright font-semibold uppercase">
            {subCategory.category?.name || "KATEGORI"}
          </span>

          <h2 className="font-head font-black text-2xl md:text-4xl lg:text-5xl text-white leading-[1.05] tracking-tighter mt-3">
            {subCategory.name}
          </h2>

          {subCategory.description && (
            <p className="text-white/80 text-sm md:text-base mt-3 max-w-lg line-clamp-2">
              {subCategory.description}
            </p>
          )}

          <div className="mt-6 md:mt-8">
            <Button
              variant="light"
              to="/sub-category/$slug"
              params={{ slug: subCategory.slug }}
            >
              JELAJAHI {subCategory.name.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Store() {
  const { banners, subCategories } = Route.useLoaderData();

  const grouped = new Map<
    string,
    {
      category: Category;
      subs: SubCategory[];
    }
  >();

  for (const sc of subCategories) {
    if (!sc.category) continue;
    if (!grouped.has(sc.categoryId)) {
      grouped.set(sc.categoryId, {
        category: sc.category,
        subs: [],
      });
    }
    grouped.get(sc.categoryId)!.subs.push(sc);
  }

  return (
    <AnimatedRoute variant="slide">
      <PageBanner
        hero={banners.hero as Banner[]}
        top={banners.top as Banner[]}
      />
      <section className="min-h-[40vh] flex flex-col justify-center pt-32 pb-12">
        <span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-6">
          TOKO RESMI · SEPEDA MOTOR &amp; SPAREPARTS
        </span>
        <h1 className="font-head font-black leading-[0.88] tracking-tighter text-[clamp(2.75rem,11vw,6.5rem)]">
          TOKO ALFA
          <br />
          SCORPII X
        </h1>
        <p className="text-[17px] md:text-[20px] text-ash max-w-lg mt-8">
          Semua yang Anda butuhkan dalam satu tempat — motor Yamaha resmi dan
          sparepart original, lengkap dengan diskon 10%.
        </p>
      </section>

      <Section className="!pt-0 !pb-8 border-none">
        <SearchBar
          className="pt-10"
          label="CARI PRODUK"
          placeholder="Nmax, X-Ride, oli mesin, sparepart..."
          fetchFn={async (query) => {
            const data = await searchProducts({ data: { query } });
            return data;
          }}
          renderItem={(p) => (
            <div className="flex items-center gap-3 w-full min-w-0">
              {p.files?.length > 0 ? (
                <img
                  src={p.files[0].url ?? ""}
                  alt={p.name}
                  className="w-9 h-9 object-cover rounded-sm flex-shrink-0 bg-paper-dim"
                />
              ) : (
                <div className="w-9 h-9 bg-paper-dim rounded-sm flex-shrink-0" />
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-semibold text-ink truncate">
                  {p.name}
                </span>
                {p.code && (
                  <span className="text-[10px] tracking-widest text-ash truncate">
                    {p.code}
                  </span>
                )}
              </div>
              <span className="ml-auto text-[14px] font-bold text-ink flex-shrink-0">
                {formatRupiah(Number(p.price))}
              </span>
            </div>
          )}
          getItemKey={(p) => p.id}
          getItemHref={(p) => `/product/${p.slug}`}
        />
      </Section>

      <BannerCarousel banners={banners.middle as Banner[]} />

      {!subCategories || subCategories.length === 0 ? (
        <Section>
          <EmptyState
            title="Tidak ada produk"
            description="Belum ada produk yang tersedia saat ini. Silakan cek kembali nanti atau hubungi admin untuk informasi lebih lanjut."
          />
        </Section>
      ) : (
        [...grouped.values()].map(({ category, subs }) => (
          <div key={category.id}>
            <Section className="!pb-0 border-none">
              <div className="flex justify-between items-end mb-6 gap-6 flex-wrap">
                <SectionHeading as="h2">{category.name}</SectionHeading>
                <Link
                  resetScroll={false}
                  to="/category/$slug"
                  params={{ slug: category.slug }}
                  state={(prev) => ({
                    ...prev,
                    skipAnimation: true,
                  })}
                  className="text-[13px] font-bold tracking-widest text-ink hover:text-blue transition-colors duration-300"
                >
                  LIHAT SEMUA {category.name.toUpperCase()} →
                </Link>
              </div>
            </Section>

            {subs.map((sc) => {
              return (
                <Section key={sc.id} className="py-8">
                  <SubCategoryBanner subCategory={sc} />
                  {sc.products && sc.products.length > 0 ? (
                    <DragScrollContainer
                      stagger
                      className="flex gap-4 md:gap-6 pb-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar mt-4"
                    >
                      {sc.products.map((p) => {
                        const isMotor = sc.category?.slug === "sepeda-motor";
                        const thumb = p.files?.find(
                          (f) => f.role === "thumbnail",
                        );
                        return (
                          <StaggerItem key={p.id}>
                            <div className="w-[260px] md:w-[280px] shrink-0 snap-start">
                              <SharedElement
                                layoutId={`category-card-${p.slug}`}
                              >
                                <MiniProductCard
                                  key={p.id}
                                  slug={p.slug}
                                  badge={
                                    p.code || sc.name.toUpperCase() || "PRODUK"
                                  }
                                  icon={isMotor ? "two_wheeler" : "settings"}
                                  name={p.name}
                                  imageUrl={thumb?.url}
                                  detail={
                                    isMotor
                                      ? `${p.stock > 0 ? `${p.stock} unit tersedia` : "Cek ketersediaan"}`
                                      : p.description || "Genuine Part Original"
                                  }
                                  price={formatRupiah(Number(p.price))}
                                  href={`/product/${p.slug}`}
                                  productId={p.id}
                                />
                              </SharedElement>
                            </div>
                          </StaggerItem>
                        );
                      })}
                    </DragScrollContainer>
                  ) : (
                    <EmptyState
                      title={`Tidak ada produk di ${sc.name}`}
                      description="Belum ada produk yang tersedia di kategori ini."
                    />
                  )}
                </Section>
              );
            })}
          </div>
        ))
      )}

      <BannerCarousel banners={banners.bottom as Banner[]} />
    </AnimatedRoute>
  );
}
