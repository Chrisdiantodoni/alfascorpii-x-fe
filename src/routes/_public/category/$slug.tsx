import { createFileRoute, Link } from "@tanstack/react-router";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { cms } from "#/data/cms";

const allSubs = cms.featuredCategories.flatMap((c) => c.subCategories);

const categoryDescriptions: Record<string, string> = {
	"sepeda-motor":
		"Jelajahi seluruh line-up resmi Yamaha — dari matic premium harian hingga motor sport performa tinggi. Garansi resmi dan layanan purna jual terbaik.",
	spareparts:
		"Genuine Parts, Yamalube, Dunlop, dan Philips — semua sparepart original untuk performa maksimal motor Yamaha Anda.",
	"premium-zone":
		"Maxi matic premium — DP ringan mulai 1,5 juta, cicilan sampai 35 bulan.",
	"fashionable-zone":
		"Desain retro-modern favorit harian, tersedia banyak pilihan warna.",
	"exciting-zone":
		"Untuk yang suka performa — konsultasi test ride gratis lewat admin.",
	"active-zone": "Matic harian irit dan lincah, cocok untuk mobilitas tinggi.",
	"genuine-parts":
		"Diskon 10% untuk semua Genuine Parts & Yamalube selama periode promo.",
	"sparepart-klasik":
		"Suku cadang untuk Yamaha generasi lama — diskon sampai 40% + gratis ongkir.",
};

const zoneIcon: Record<string, string> = {
	"sub-premium": "two_wheeler",
	"sub-fashionable": "moped",
	"sub-exciting": "sports_motorsports",
	"sub-active": "electric_moped",
};

function rupiah(n: number | null) {
	if (n == null || n === 0) return "Cek ketersediaan";
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(n);
}

function getProductType(product: (typeof cms.featuredProducts)[number]) {
	const sub = cms.featuredCategories
		.flatMap((c) => c.subCategories)
		.find((s) => s.id === product.subCategoryId);
	if (!sub) return "genuine";
	const parentCat = cms.featuredCategories.find((c) =>
		c.subCategories.some((s) => s.id === sub.id),
	);
	if (parentCat && parentCat.slug === "sepeda-motor") return "motor";
	return sub.slug === "sparepart-klasik" ? "legacy" : "genuine";
}

function mapToMiniCard(product: (typeof cms.featuredProducts)[number]) {
	const type = getProductType(product);
	const sub = allSubs.find((s) => s.id === product.subCategoryId);
	const year = product.specValues?.find((s) => s.key === "year");

	const badge =
		type === "motor"
			? sub?.name.toUpperCase() || "MOTOR"
			: type === "legacy"
				? "KLASIK"
				: product.code || "SPAREPART";

	const icon =
		type === "motor"
			? zoneIcon[product.subCategoryId] || "two_wheeler"
			: "settings";

	const detail =
		type === "motor"
			? `${product.stock > 0 ? `${product.stock} unit tersedia` : "Cek ketersediaan"}${year ? ` · ${year.value}` : ""}`
			: "";

	const price = rupiah(product.price);

	return {
		badge,
		icon,
		name: product.name,
		detail,
		price,
		href: `/product/${product.slug}`,
	};
}

export const Route = createFileRoute("/_public/category/$slug")({
	component: CategoryPage,
});

function CategoryPage() {
	const { slug } = Route.useParams();

	const parentCat = cms.featuredCategories.find((c) => c.slug === slug);
	const sub = allSubs.find((s) => s.slug === slug);

	const title = parentCat?.name || sub?.name || "Kategori";
	const description =
		categoryDescriptions[slug] ||
		"Temukan produk terbaik untuk kebutuhan Anda.";

	const products = parentCat
		? cms.featuredProducts.filter((p) =>
				parentCat.subCategories.some((s) => s.id === p.subCategoryId),
			)
		: cms.featuredProducts.filter((p) => p.subCategoryId === sub?.id);

	return (
		<>
			<section className="pt-32 pb-8">
				<Link
					to="/store"
					className="inline-flex items-center gap-2 text-[11px] tracking-widest text-ash hover:text-blue transition-colors"
				>
					<span className="text-[16px]">←</span>
					KEMBALI KE TOKO
				</Link>
			</section>

			<Section className="!pt-0">
				<SectionHeading className="mb-4">{title}</SectionHeading>
				<p className="text-ash max-w-2xl mb-10">{description}</p>

				{products.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((p) => {
							const props = mapToMiniCard(p);
							return <MiniProductCard key={p.id} {...props} />;
						})}
					</div>
				) : (
					<p className="text-ash text-center py-16">
						Belum ada produk di kategori ini.
					</p>
				)}
			</Section>
		</>
	);
}
