import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
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
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { getBanners, getPages } from "#/server/cms";
import {
  getAllProducts,
  getSiteSettings,
  getSubCategories,
  searchProducts,
} from "#/server/master";
import { formatRupiah } from "#/utils/fn";
import { SharedElement } from "#/components/SharedElements";
import { AnimatedRoute } from "#/components/AnimatedRoute";
import type { Category, SubCategory } from "#/types";
import { Image } from "#/components/ui/Image";
import { Button } from "#/components/ui/Button";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { SwiperContainer } from "#/components/ui/SwiperContainer";
import PageHeader from "#/components/ui/PageHeader";

export const Route = createFileRoute("/_public/store/")({
  component: Store,
  loader: async ({ location }) => {
    const [banners, subCategories, products, page] = await Promise.all([
      getBanners({ data: { pathname: location.pathname } }),
      getSubCategories(),
      getAllProducts({ data: { is_lineup: true } }),
      getSiteSettings({ data: { key: "store_page" } }),
    ]);
    return {
      banners,
      subCategories,
      products,
      page: page?.store_page,
    };
  },
});

function SubCategoryBanner({ subCategory }: { subCategory: SubCategory }) {
  const thumbnail = subCategory.files?.find((f) => f.role === "thumbnail");

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-line/40 bg-ink-2 min-h-[240px] md:min-h-[360px] group">
      {/* Background Image */}
      {thumbnail?.url && (
        <Image
          layout="fullWidth"
          src={thumbnail.url}
          alt={subCategory.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          priority={false}
        />
      )}

      {/* Fallback watermark */}
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/5" />

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

// Komponen Carousel Khusus untuk SubCategoryBanner
function SubCategoryBannerCarousel({ subs }: { subs: SubCategory[] }) {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);

  if (!subs || subs.length === 0) return null;

  if (subs.length === 1) {
    return <SubCategoryBanner subCategory={subs[0]} />;
  }

  return (
    <div className="relative group">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoHeight
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onBeforeInit={(swiper: SwiperClass) => {
          if (typeof swiper.params.navigation !== "boolean") {
            swiper.params.navigation!.prevEl = prevEl;
            swiper.params.navigation!.nextEl = nextEl;
          }
          if (typeof swiper.params.pagination !== "boolean") {
            swiper.params.pagination!.el = paginationEl;
          }
        }}
        navigation={{ prevEl, nextEl }}
        pagination={{ el: paginationEl, clickable: true }}
        loop
        className="w-full rounded-2xl"
      >
        {subs.map((subCategory) => (
          <SwiperSlide key={subCategory.id}>
            <SubCategoryBanner subCategory={subCategory} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigasi Prev/Next */}
      <button
        type="button"
        ref={setPrevEl}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
        aria-label="Slide sebelumnya"
      >
        <MaterialIcon name="arrow_back" className="!text-[22px]" />
      </button>
      <button
        type="button"
        ref={setNextEl}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
        aria-label="Slide berikutnya"
      >
        <MaterialIcon name="arrow_forward" className="!text-[22px]" />
      </button>

      {/* Pagination Bullets */}
      <div
        ref={setPaginationEl}
        className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2 [&>.swiper-pagination-bullet]:w-2.5 [&>.swiper-pagination-bullet]:h-2.5 [&>.swiper-pagination-bullet]:bg-white/50 [&>.swiper-pagination-bullet-active]:!bg-white [&>.swiper-pagination-bullet-active]:w-8 [&>.swiper-pagination-bullet]:rounded-full [&>.swiper-pagination-bullet]:transition-all [&>.swiper-pagination-bullet]:duration-300"
      />
    </div>
  );
}

function Store() {
  const { banners, subCategories, products, page } = Route.useLoaderData();
  console.log(page);

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
      <PageHeader
        subtitle={page?.subtitle ?? "Store Alfa Scorpii X"}
        title={page?.title ?? "Spareparts & Sepeda Motor"}
        badgeAccent={false}
        description={
          page?.description ??
          "Semua yang Anda butuhkan dalam satu tempat — motor Yamaha resmi dan sparepart original."
        }
      />
      {/*<section className="min-h-[40vh] flex flex-col justify-center pt-32 pb-12">
        <span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-6">
          SEPEDA MOTOR &amp; SPAREPARTS
        </span>
        <h1 className="font-head font-black leading-[0.88] tracking-tighter text-[clamp(2.75rem,11vw,6.5rem)]">
          ALFA
          <br />
          SCORPII X
        </h1>
        <p className="text-[17px] md:text-[20px] text-ash max-w-lg mt-8">
          Semua yang Anda butuhkan dalam satu tempat — motor Yamaha resmi dan
          sparepart original, lengkap dengan diskon 10%.
        </p>
      </section>*/}

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

      {products.length > 0 && (
        <Section className="pt-8 border-none pb-4">
          <SectionHeading as="h2">Line-up Produk</SectionHeading>
          <SwiperContainer className="mt-8" stagger key="products-swiper">
            {products.map((item) => {
              const thumb = item.files?.find((f) => f.role === "thumbnail");
              return (
                <StaggerItem key={item.id}>
                  <SharedElement layoutId={`category-card-${item.slug}`}>
                    <MiniProductCard
                      slug={item.slug}
                      badge={item.code}
                      name={item.name}
                      imageUrl={thumb?.url}
                      detail={item.subCategory.name}
                      price={formatRupiah(Number(item.price))}
                      href={`/product/${item.slug}`}
                      productId={item.id}
                    />
                  </SharedElement>
                </StaggerItem>
              );
            })}
          </SwiperContainer>
        </Section>
      )}

      {!subCategories || subCategories.length === 0 ? (
        <Section>
          <EmptyState
            title="Tidak ada produk"
            description="Belum ada produk yang tersedia saat ini. Silakan cek kembali nanti atau hubungi admin untuk informasi lebih lanjut."
          />
        </Section>
      ) : (
        [...grouped.values()].map(({ category, subs }) => (
          <div key={category.id} className="mb-8">
            <Section className="!pb-6 border-none pt-8">
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

              {/* Render Swiper khusus SubCategoryBanner per kategori */}
              <SubCategoryBannerCarousel subs={subs} />
            </Section>
          </div>
        ))
      )}

      <BannerCarousel banners={banners.bottom as Banner[]} />
    </AnimatedRoute>
  );
}
