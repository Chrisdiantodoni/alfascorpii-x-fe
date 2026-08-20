import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import z from "zod";
import { PageBanner } from "#/components/PageBanner";
import { SharedElement } from "#/components/SharedElements";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import CategorySidebar from "#/components/ui/CategorySidebar";
import { EmptyState } from "#/components/ui/EmptyState";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { SortSelect } from "#/components/ui/SortSelect";
import { TextInput } from "#/components/ui/TextInput";
import { bannerQueryOptions } from "#/queries/cms";
import { getSubCategoryBySlug } from "#/server/master";
import type { Category, FeaturedProduct, SubCategory } from "#/types";
import { formatRupiah } from "#/utils/fn";
import { AnimatedRoute } from "#/components/AnimatedRoute";

function mapToMiniCard(product: FeaturedProduct) {
  const type = product.subCategory?.name?.toLowerCase() || "";
  const year = product?.specValues?.find((s) => s.key === "year");

  const badge =
    product.subCategory?.name?.toUpperCase() ||
    product.code?.toUpperCase() ||
    "PRODUK";

  const icon = "two-wheel";
  const imageUrl = product?.images.find(
    (find) => find.role === "thumbnail",
  )?.url;

  const detail =
    type === "motor"
      ? `${product.stock > 0 ? `${product.stock} unit tersedia` : "Cek ketersediaan"}${year ? ` · ${year.value}` : ""}`
      : "";

  const price = formatRupiah(Number(product.price));

  return {
    badge,
    icon,
    imageUrl,
    name: product.name,
    slug: product.slug,
    detail,
    price,
    href: `/product/${product.slug}`,
    productId: product.id,
  };
}

const subCategorySearchSchema = z.record(z.string(), z.string().optional());

export const Route = createFileRoute("/_public/sub-category/$slug")({
  component: SubCategoryPage,
  validateSearch: (search) => subCategorySearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ params, deps: { search }, context }) => {
    const [res] = await Promise.all([
      getSubCategoryBySlug({
        data: { slug: params.slug, ...search },
      }),
      context.queryClient.ensureQueryData(bannerQueryOptions(params.slug)),
    ]);

    return { res };
  },
});

function SubCategoryPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const search = Route.useSearch() as Record<string, string | undefined>;
  const {
    res,
  }: {
    res: {
      subCategory: SubCategory;
      category: Category;
      products: FeaturedProduct[];
    };
  } = Route.useLoaderData();
  const { data: banners } = useSuspenseQuery(bannerQueryOptions(slug));

  if (!res.subCategory) {
    return (
      <Section className="pt-32">
        <EmptyState
          title="Kategori tidak ditemukan"
          description="Kategori yang Anda cari tidak tersedia atau telah dihapus."
          action={{ label: "Kembali ke Toko", to: "/store" }}
        />
      </Section>
    );
  }

  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const products = res.products;
  const hasSidebar =
    Array.isArray(res?.category?.specTemplate) &&
    res.category.specTemplate.length > 0;
  const isSparepart = res?.category?.name?.toLowerCase().includes("sparepart");
  const sort = search.sort;

  const handleSortChange = (value: string) => {
    navigate({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        sort: value === "recommended" ? undefined : value,
      }),
      replace: true,
    });
  };

  return (
    <AnimatedRoute variant="slide">
      <PageBanner hero={banners.hero} top={banners.top} />
      <section
        className={`${banners.hero.length > 0 || banners.top.length > 0 ? "pt-18 " : "pt-32 lg:pt-28"} pb-8`}
      >
        <Link
          resetScroll={false}
          to="/store"
          className="hover:text-blue inline-flex items-center gap-2 text-[11px] tracking-widest text-ash transition-colors"
        >
          <MaterialIcon name="arrow_back" className="!text-[16px]" />
          KEMBALI
        </Link>
      </section>
      <BannerCarousel banners={banners.middle} className="-mx-6 md:-mx-16" />

      <Section className="pt-8">
        <div
          className={`grid grid-cols-1 gap-10 ${hasSidebar ? "lg:grid-cols-6" : ""}`}
        >
          {hasSidebar && (
            <CategorySidebar specTemplate={res.category.specTemplate} />
          )}

          <div className={hasSidebar ? "lg:col-span-5" : ""}>
            <SectionHeading className="mb-4">{title}</SectionHeading>
            <p className="mb-10 max-w-2xl text-ash">
              {res.category?.description}
            </p>
            <div className="w-full pb-8  flex flex-wrap items-end justify-between gap-4">
              <TextInput
                fontSize={14}
                placeholder={`Nmax, Gear Ultima, Filano`}
                label={`Cari ${title}`}
                className="flex-1 min-w-[240px]"
              />
              {isSparepart && (
                <SortSelect value={sort} onChange={handleSortChange} />
              )}
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((p) => {
                  const props = mapToMiniCard(p as unknown as FeaturedProduct);
                  return (
                    <SharedElement
                      key={p.id}
                      layoutId={`category-card-${p.slug}`}
                      transition={{
                        duration: 0.45,
                        ease: [0.32, 0.72, 0, 1],
                      }}
                    >
                      <MiniProductCard {...props} />
                    </SharedElement>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={`Tidak ada produk di ${title}`}
                description="Belum ada produk yang tersedia di kategori ini."
              />
            )}
          </div>
        </div>
      </Section>
      <BannerCarousel banners={banners.bottom} className="-mx-6 md:-mx-16" />
    </AnimatedRoute>
  );
}
