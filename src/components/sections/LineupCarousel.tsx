import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { DragScrollContainer } from "#/components/ui/DragScrollContainer";
import { MiniProductCard } from "#/components/ui/MiniProductCard";
import { cms } from "#/data/cms";

export default function LineupCarousel() {
	const motorCat = cms.featuredCategories.find(
		(c) => c.slug === "sepeda-motor",
	);
	const products = cms.featuredProducts.filter((p) =>
		motorCat?.subCategories.some((s) => s.id === p.subCategoryId),
	);

	return (
		<motion.section
			className="py-24 border-t border-line scroll-mt-24"
			initial={{ opacity: 0, y: 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-64px" }}
			transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
		>
			<h2 className="font-head font-bold text-2xl sm:text-3xl md:text-5xl tracking-tighter mb-3">
				Line-up
			</h2>
			<h2 className="font-head font-bold text-2xl sm:text-3xl md:text-5xl tracking-tighter text-blue mb-12">
				Terpilih
			</h2>
			<p className="text-ash max-w-md mb-12">
				Dari matic premium sampai motor sport — arahkan kursor untuk menggeser.
				Geser kiri/kanan untuk lihat semua unit.
			</p>

			<DragScrollContainer className="auto-cols-[280px] gap-6">
				{products.map((p) => {
					const year = p.specValues.find((s) => s.key === "year");
					return (
						<MiniProductCard
							key={p.id}
							// badge={(subNames[p.subCategoryId] || "").toUpperCase()}
							// icon={zoneIcon[p.subCategoryId] || "two_wheeler"}
							name={p.name}
							detail={
								year
									? `${p.stock > 0 ? `${p.stock} unit tersedia` : "Cek ketersediaan"} · ${year.value}`
									: p.stock > 0
										? `${p.stock} unit tersedia`
										: "Cek ketersediaan"
							}
							href={`/product/${p.slug}`}
						/>
					);
				})}
			</DragScrollContainer>

			<Link
				to="/store"
				className="inline-block mt-10 text-[12px] font-semibold tracking-widest border-b border-ink pb-1 hover:text-blue transition-colors"
			>
				LIHAT SEMUA →
			</Link>
		</motion.section>
	);
}
