import { createFileRoute, Link } from "@tanstack/react-router";
import Hero from "#/components/sections/Hero";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";
import { DragScrollContainer } from "#/components/ui/DragScrollContainer";
import { EmptyState } from "#/components/ui/EmptyState";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { Section } from "#/components/ui/Section";
import { SectionHeading } from "#/components/ui/SectionHeading";
import { StaggerItem } from "#/components/ui/StaggerItem";
import { getBanners } from "#/server/cms";
import { getSubCategories } from "#/server/master";
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
	const addItem = useCartStore((s) => s.addItem);

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
				height="250px"
				className="-mx-6 md:-mx-16"
			/>
			<section className="min-h-[60vh] flex flex-col justify-center pt-32 pb-12">
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

			<BannerCarousel banners={banners.middle as Banner[]} height="350px" />

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
						<Section className="!pb-0">
							<div className="flex justify-between items-end mb-6 gap-6 flex-wrap">
								<SectionHeading as="h2">{category.name}</SectionHeading>
								<Link
									to="/category/$slug"
									params={{ slug: category.slug }}
									className="text-[13px] font-bold tracking-widest text-ink hover:text-blue transition-colors duration-300"
								>
									LIHAT SEMUA {category.name.toUpperCase()} →
								</Link>
							</div>
						</Section>

						{subs.map((sc) => (
							<Section key={sc.id}>
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
								<p className="text-ash max-w-md mb-8">
									{subcatPromos[sc.slug] || ""}
								</p>

								{sc.products.length > 0 ? (
									<DragScrollContainer
										stagger
										className="grid grid-cols-5 gap-6"
									>
										{sc.products.map((p) => (
											<StaggerItem key={p.id}>
												<MiniProductCard
													key={p.id}
													badge={p.code || sc.name.toUpperCase() || "PRODUK"}
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
											</StaggerItem>
										))}
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

			<BannerCarousel banners={banners.bottom as Banner[]} height="350px" />
		</>
	);
}
