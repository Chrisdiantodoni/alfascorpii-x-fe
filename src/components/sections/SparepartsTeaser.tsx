import { motion } from "motion/react";
import { DragScrollContainer } from "#/components/ui/DragScrollContainer";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { cms } from "#/data/cms";

export default function SparepartsTeaser() {
	const partsCat = cms.featuredCategories.find((c) => c.slug === "spareparts");
	const products = cms.featuredProducts
		.filter((p) =>
			partsCat?.subCategories.some((s) => s.id === p.subCategoryId),
		)
		.slice(0, 6);

	function rupiah(n: number | null) {
		if (n == null) return "Cek ketersediaan";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		}).format(n);
	}

	return (
		<motion.section
			className="py-24 border-t border-line scroll-mt-24"
			initial={{ opacity: 0, y: 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-64px" }}
			transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
		>
			<span className="block text-[12px] tracking-widest text-ash mb-4">
				ALFA SCORPII SPAREPARTS
			</span>
			<h2 className="font-head font-black text-3xl sm:text-4xl md:text-6xl leading-tight mb-6 max-w-3xl">
				Genuine Parts,
				<br />
				Performa Original.
			</h2>
			<p className="text-ash max-w-lg mb-8">
				Yamalube, Yamaha Genuine Parts, Dunlop dan Philips — diskon 10% untuk
				semua sparepart original selama periode promo.
			</p>
			<a
				href="/store"
				className="inline-flex items-center gap-2 border border-ink px-8 py-4 text-[12px] font-semibold tracking-widest hover:bg-ink hover:text-white transition-all"
			>
				KUNJUNGI TOKO <span className="text-[16px]">→</span>
			</a>

			<DragScrollContainer className="mt-16 auto-cols-[280px] gap-6">
				{products.map((p) => (
					<MiniProductCard
						key={p.id}
						badge={p.code || "SPAREPART"}
						icon="settings"
						name={p.name}
						slug={p.slug}
						detail={rupiah(p.price)}
						href={`/product/${p.slug}`}
					/>
				))}
			</DragScrollContainer>
		</motion.section>
	);
}
