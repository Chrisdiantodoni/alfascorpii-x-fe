import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo } from "react";
import { DragScrollContainer } from "#/components/ui/DragScrollContainer";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import type { Category, FeaturedProduct } from "#/types/master";

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

function rupiah(n: string | null) {
	const num = n ? Number(n) : null;
	if (num == null) return "Cek ketersediaan";
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(num);
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
			<DragScrollContainer className="mt-16 auto-cols-[280px] gap-6 py-2 -my-2">
				{products.map(({ product, subCategoryName }) =>
					cardMode === "sparepart"
						? renderSparepartCard(product)
						: renderMotorCard(product, subCategoryName),
				)}
			</DragScrollContainer>

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
	if (!product.specValues || typeof product.specValues !== "object")
		return undefined;
	const spec = product.specValues as Record<string, unknown>;
	if (Array.isArray(spec)) {
		const found = (spec as Array<{ key: string; value: string }>).find(
			(s) => s.key === "year",
		);
		return found?.value;
	}
	return typeof spec.year === "string" ? spec.year : undefined;
}

function renderSparepartCard(product: FeaturedProduct) {
	const imageUrl = product.images.find((find) => find.role === "thumbnail");
	return (
		<MiniProductCard
			key={product.id}
			badge={product.code || "SPAREPART"}
			icon="settings"
			name={product.name}
			detail=""
			imageUrl={imageUrl && imageUrl.url}
			price={rupiah(product.price)}
			href={`/product/${product.slug}`}
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
			imageUrl={imageUrl && imageUrl.url}
			detail={detail}
			price={rupiah(product.price)}
			href={`/product/${product.slug}`}
		/>
	);
}
