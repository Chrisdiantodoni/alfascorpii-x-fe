import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "#/components/ui/EmptyState";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { getSubCategoryBySlug } from "#/server/master";
import { formatRupiah } from "#/utils/fn";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import Hero from "#/components/sections/Hero";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getBanners } from "#/server/cms";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import CategorySidebar from "#/components/ui/CategorySidebar";
import { TextInput } from "#/components/ui/TextInput";
import type { Category, FeaturedProduct, SubCategory } from "#/types";
import { motion } from "motion/react";

function mapToMiniCard(product: FeaturedProduct) {
  const type = product.subCategory?.name?.toLowerCase() || "";
  const year = product?.specValues?.find((s) => s.key === "year");

  // Fix: Gunakan product.subCategory?.name secara langsung
  const badge =
    type === "motor"
      ? product.subCategory?.name?.toUpperCase() || "MOTOR"
      : type === "legacy"
        ? "KLASIK"
        : product.code || "SPAREPART";

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

export const Route = createFileRoute("/_public/sub-category/$slug")({
  component: SubCategoryPage,
  loader: async ({ params }) => {
    const res = await getSubCategoryBySlug({
      data: { slug: params.slug },
    });
    return { res };
  },
});

function SubCategoryPage() {
  const { slug } = Route.useParams();
  const {
    res,
  }: {
    res: {
      subCategory: SubCategory;
      category: Category;
      products: FeaturedProduct[];
    };
  } = Route.useLoaderData();

  console.log(res);
  const { data: banners } = useSuspenseQuery({
    queryKey: ["banners", slug],
    queryFn: () => getBanners({ data: { pathname: slug } }),
    staleTime: Infinity,
  });
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

  return (
    <>
      <Hero banners={banners.hero} />
      <BannerCarousel banners={banners.top} className="-mx-6 md:-mx-16" />
      <section
        className={`${banners.hero.length > 0 || banners.top.length > 0 ? "pt-18" : "pt-24"} pb-8`}
      >
        <Link
          to="/store"
          className="hover:text-blue inline-flex items-center gap-2 text-[11px] tracking-widest text-ash transition-colors"
        >
          <MaterialIcon name="arrow_back" className="!text-[16px]" />
          KEMBALI
        </Link>
      </section>

      <Section className="pt-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">
          {Array.isArray(res?.category?.specTemplate) &&
            res.category.specTemplate.length > 0 && (
              <CategorySidebar specTemplate={res.category.specTemplate} />
            )}

          <div className="lg:col-span-5">
            <SectionHeading className="mb-4">{title}</SectionHeading>
            <p className="mb-10 max-w-2xl text-ash">
              {res.category?.description}
            </p>
            <div className="w-full pb-8 ">
              <TextInput
                fontSize={14}
                placeholder={`Nmax, Gear Ultima, Filano`}
                label={`Cari ${title}`}
              />
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((p) => {
                  const props = mapToMiniCard(p as unknown as FeaturedProduct);
                  return (
                    <motion.div
                      key={p.id}
                      layoutId={`category-card-${p.slug}`}
                      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                    >
                      <MiniProductCard {...props} />
                    </motion.div>
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
    </>
  );
}
