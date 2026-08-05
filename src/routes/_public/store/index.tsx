import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import Hero from "#/components/sections/Hero";
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

function Store() {
  const { banners, subCategories } = Route.useLoaderData();

  const grouped = new Map<
    string,
    {
      category: (typeof subCategories)[number]["category"];
      subs: typeof subCategories;
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
    <>
      <Hero banners={banners.hero as Banner[]} />

      <BannerCarousel
        banners={banners.top as Banner[]}
        className="-mx-6 md:-mx-16"
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
              {p.files.length > 0 ? (
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

      {subCategories.length === 0 ? (
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

            {subs.map((sc) => (
              <Section key={sc.id} className="py-8">
                <div className="flex justify-between items-end mb-6 gap-6 flex-wrap">
                  <div>
                    <span className="block text-[12px] tracking-widest text-ash mb-2">
                      KATEGORI
                    </span>
                    <SectionHeading as="h3" className="!text-2xl">
                      {sc.name}
                    </SectionHeading>
                  </div>
                  <Link
                    to="/sub-category/$slug"
                    params={{ slug: sc.slug }}
                    className="text-[11px] font-bold tracking-widest text-ink hover:text-blue transition-colors duration-300"
                  >
                    LIHAT SEMUA {sc.name.toUpperCase()} →
                  </Link>
                </div>
                <p className="text-ash max-w-md mb-8">{sc.description}</p>

                {sc.products.length > 0 ? (
                  <DragScrollContainer
                    stagger
                    className="grid md:grid-cols-5 gap-6"
                  >
                    {sc.products.map((p) => {
                      const isMotor = sc.category?.slug === "sepeda-motor";
                      const thumb = p.files.find((f) => f.role === "thumbnail");
                      return (
                        <StaggerItem key={p.id}>
                          <motion.div
                            key={p.id}
                            layoutId={`category-card-${p.slug}`}
                            transition={{
                              duration: 0.45,
                              ease: [0.32, 0.72, 0, 1],
                            }}
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
                          </motion.div>
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
            ))}
          </div>
        ))
      )}

      <BannerCarousel banners={banners.bottom as Banner[]} />
    </>
  );
}
