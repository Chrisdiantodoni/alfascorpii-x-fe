import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/Button";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { cms } from "#/data/cms";

function rupiah(n: number | null) {
	if (n == null) return null;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(n);
}

export const Route = createFileRoute("/_public/product/$slug/")({
	component: ProductDetail,
});

function ProductDetail() {
	const { slug } = Route.useParams();
	const product = cms.featuredProducts.find((p) => p.slug === slug);

	if (!product) {
		return (
			<div className="pt-32 text-center">
				<p className="text-ash">Produk tidak ditemukan.</p>
				<Link
					to="/store"
					className="text-blue hover:underline mt-4 inline-block"
				>
					Kembali ke Toko
				</Link>
			</div>
		);
	}

	const sub = cms.featuredCategories
		.flatMap((c) => c.subCategories)
		.find((s) => s.id === product.subCategoryId);

	const related = product.relatedProducts
		.map((rp) => cms.featuredProducts.find((p) => p.id === rp.id))
		.filter(Boolean);

	return (
		<>
			<section className="pt-32 pb-8">
				<Link
					to="/store"
					className="inline-flex items-center gap-2 text-[11px] tracking-widest text-ash hover:text-blue transition-colors"
				>
					<MaterialIcon name="arrow_back" className="!text-[16px]" />
					KEMBALI KE TOKO
				</Link>
			</section>

			<section className="pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
				<div>
					<div className="aspect-square bg-paper-dim flex items-center justify-center mb-4">
						<MaterialIcon name="settings" className="text-blue !text-[80px]" />
					</div>
				</div>
				<div>
					{sub && (
						<span className="text-[12px] tracking-widest text-blue-bright font-semibold">
							{sub.name.toUpperCase()}
						</span>
					)}
					<h1 className="font-head font-black text-3xl md:text-4xl tracking-tight mt-3 mb-2">
						{product.name}
					</h1>
					{product.code && (
						<p className="text-[12px] text-ash mb-6">{product.code}</p>
					)}
					<p className="font-head font-bold text-2xl mb-6">
						{product.price != null ? rupiah(product.price) : "Hubungi admin"}
					</p>
					<p className="text-ash leading-relaxed mb-8 max-w-lg">
						{product.description}
					</p>

					{product.colors.length > 0 && (
						<div className="mb-8">
							<span className="block text-[11px] tracking-widest text-ash mb-3">
								PILIHAN WARNA
							</span>
							<div className="flex gap-3">
								{product.colors.map((c) => (
									<div
										key={c.id}
										className="w-8 h-8 rounded-full border border-line cursor-pointer hover:scale-110 transition-transform"
										style={{ backgroundColor: c.hex }}
										title={c.name}
									/>
								))}
							</div>
						</div>
					)}

					<p className="text-[13px] mb-8">
						{product.stock > 0
							? `${product.stock} unit tersedia`
							: "Cek ketersediaan"}
					</p>

					<Button className="w-full sm:w-auto">
						{product.price != null ? "TAMBAH KE KERANJANG" : "HUBUNGI ADMIN"}
					</Button>

					{product.specValues.length > 0 && (
						<div className="mt-12">
							<span className="block text-[11px] tracking-widest text-ash mb-3">
								SPESIFIKASI
							</span>
							<div className="space-y-2">
								{product.specValues.map((spec) => (
									<div
										key={spec.key}
										className="flex justify-between py-2 border-b border-line text-sm"
									>
										<span className="text-ash">{spec.label}</span>
										<span className="font-semibold">{spec.value}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</section>

			{related.length > 0 && (
				<section className="pb-24 border-t border-line pt-16">
					<h3 className="font-head font-bold text-xl mb-8">Produk Terkait</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{related.map((p) =>
							p ? (
								<Link
									key={p.id}
									to="/product/$slug"
									params={{ slug: p.slug }}
									className="block bg-white border border-line p-6 group hover:border-blue transition-colors"
								>
									<div className="flex items-center justify-center py-4">
										<MaterialIcon
											name="settings"
											className="text-blue !text-[36px]"
										/>
									</div>
									<h4 className="font-head font-bold text-sm group-hover:text-blue transition-colors">
										{p.name}
									</h4>
								</Link>
							) : null,
						)}
					</div>
				</section>
			)}
		</>
	);
}
