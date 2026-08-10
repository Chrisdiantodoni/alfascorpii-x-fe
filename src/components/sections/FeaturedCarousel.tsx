import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo } from "react";
import { DragScrollContainer } from "#/components/ui/DragScrollContainer";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import type { Category, FeaturedProduct } from "#/types/master";
import { formatRupiah } from "#/utils/fn";
import { SwiperContainer } from "../ui/SwiperContainer";

interface FeaturedCarouselProps {
  label?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaVariant?: "button" | "link";
  categorySlug: string;
  categories: Category[];
  cardMode: "motor" | "sparepart";
}

interface ProductWithSub {
  product: FeaturedProduct;
  subCategoryName: string;
}

export default function FeaturedCarousel({
  label,
  title,
  description,
  ctaText,
  ctaVariant = "link",
  categorySlug,
  categories,
  cardMode,
}: FeaturedCarouselProps) {
  const category = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  );

  const products = useMemo<ProductWithSub[]>(() => {
    if (!category) return [];
    return category.subCategories.flatMap(
      (sub) =>
        sub.products?.map((p) => ({
          product: p as FeaturedProduct,
          subCategoryName: sub.name,
        })) ?? [],
    );
  }, [category]);

  if (!category || products.length === 0) return null;

  return (
    <motion.section
      className="py-24 border-t border-line scroll-mt-24"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {label && (
        <span className="block text-[12px] tracking-widest text-ash mb-4">
          {label}
        </span>
      )}
      <h2 className="font-head font-black text-3xl sm:text-4xl md:text-6xl leading-tight mb-6 max-w-3xl">
        {title}
      </h2>
      {description && <p className="text-ash max-w-lg mb-8">{description}</p>}
      <SwiperContainer className="mt-8" stagger>
        {products.map(({ product, subCategoryName }) =>
          cardMode === "sparepart"
            ? renderSparepartCard(product)
            : renderMotorCard(product, subCategoryName),
        )}
      </SwiperContainer>

      {ctaText && (
        <Link
          to="/store"
          className={
            ctaVariant === "button"
              ? "inline-flex items-center gap-2 border border-ink px-8 py-4 text-[12px] font-semibold tracking-widest hover:bg-ink hover:text-white transition-all mt-10"
              : "inline-block mt-10 text-[12px] font-semibold tracking-widest border-b border-ink pb-1 hover:text-blue transition-colors"
          }
        >
          {ctaText}
          {ctaVariant === "button" ? (
            <span className="text-[16px]"> →</span>
          ) : (
            " →"
          )}
        </Link>
      )}
    </motion.section>
  );
}

function getYear(product: FeaturedProduct): string | undefined {
  const specs = product.specValues;

  if (!specs || typeof specs !== "object") {
    return undefined;
  }

  // Handle Array structure: [{ key: "year", value: "2024" }]
  if (Array.isArray(specs)) {
    const found = specs.find((s) => s?.key === "year");
    return typeof found?.value === "string" ? found.value : undefined;
  }

  // Handle Object structure: { year: "2024" }
  const yearVal = specs.year;
  return typeof yearVal === "string" ? yearVal : undefined;
}

function renderSparepartCard(product: FeaturedProduct) {
  const imageUrl = product.images.find((find) => find.role === "thumbnail");
  return (
    <MiniProductCard
      key={product.id}
      badge={product.code || "SPAREPART"}
      icon="settings"
      name={product.name}
      slug={product.slug}
      detail={product.description || "Genuine Part Original"}
      imageUrl={imageUrl ? imageUrl.url : undefined}
      price={formatRupiah(Number(product.price))}
      href={`/product/${product.slug}`}
      productId={product.id}
    />
  );
}

function renderMotorCard(product: FeaturedProduct, subCategoryName: string) {
  const year = getYear(product);
  const stock =
    product.stock > 0 ? `${product.stock} unit tersedia` : "Cek ketersediaan";
  const detail = year ? `${stock} · ${year}` : stock;
  const imageUrl = product.images.find((find) => find.role === "thumbnail");

  return (
    <MiniProductCard
      key={product.id}
      badge={subCategoryName.toUpperCase()}
      icon="two_wheeler"
      name={product.name}
      slug={product.slug}
      imageUrl={imageUrl ? imageUrl.url : undefined}
      detail={detail}
      price={formatRupiah(Number(product.price))}
      href={`/product/${product.slug}`}
      productId={product.id}
    />
  );
}
