import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "#/components/ui/EmptyState";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { getSubCategoryBySlug } from "#/server/master";
import { useCartStore } from "#/stores/cart";
import { formatRupiah } from "#/utils/fn";

const subcatPromos: Record<string, string> = {
	"premium-zone":
		"Unit maxi matic premium — DP ringan mulai 1,5 juta, cicilan sampai 35 bulan.",
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

export const Route = createFileRoute("/_public/sub-category/$slug")({
	component: SubCategoryPage,
	loader: async ({ params }) => {
		const subCategory = await getSubCategoryBySlug({
			data: { slug: params.slug },
		});
		return { subCategory };
	},
});

function SubCategoryPage() {
	const { subCategory } = Route.useLoaderData();
	const addItem = useCartStore((s) => s.addItem);

	if (!subCategory) {
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

	const description =
		subcatPromos[subCategory.slug] ||
		`Jelajahi semua produk di kategori ${subCategory.name}.`;

	return (
		<>
			<section className="pt-32 pb-8">
				<Link
					to="/store"
					className="inline-flex items-center gap-2 text-[11px] tracking-widest text-ash hover:text-blue transition-colors"
				>
					<span aria-hidden="true" className="text-[16px]">
						←
					</span>
					KEMBALI KE TOKO
				</Link>
			</section>

			<Section className="!pt-0">
				<SectionHeading className="mb-4">{subCategory.name}</SectionHeading>
				<p className="text-ash max-w-2xl mb-10">{description}</p>

				{subCategory.products.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{subCategory.products.map((p) => (
							<MiniProductCard
								key={p.id}
								badge={p.code || subCategory.name.toUpperCase() || "PRODUK"}
								icon="settings"
								name={p.name}
								detail={formatRupiah(Number(p.price))}
								href={`/product/${p.slug}`}
								productId={p.id}
								onAddToCart={() =>
									addItem({
										id: p.id,
										name: p.name,
										price: Number(p.price),
										code: p.code,
									})
								}
							/>
						))}
					</div>
				) : (
					<EmptyState
						title={`Tidak ada produk di ${subCategory.name}`}
						description="Belum ada produk yang tersedia di kategori ini."
						action={{ label: "Kembali ke Toko", to: "/store" }}
					/>
				)}
			</Section>
		</>
	);
}
