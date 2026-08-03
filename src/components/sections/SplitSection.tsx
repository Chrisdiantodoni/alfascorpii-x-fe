import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { Category } from "#/types/master";

export default function SplitSection({
	categories,
}: {
	categories: Category[];
}) {
	const totalItems = categories.length;

	return (
		<motion.section
			className="grid grid-cols-1 sm:grid-cols-2 border-t border-line scroll-mt-24"
			initial={{ opacity: 0, y: 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-64px" }}
			transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
		>
			{categories.map((cat, index) => {
				// Cek apakah item ini berada di baris terakhir dan jumlah total data ganjil
				const isOddTotal = totalItems % 2 !== 0;
				const isLastItem = index === totalItems - 1;
				const shouldFullWidth = isOddTotal && isLastItem;

				// Ambil daftar sub-kategori untuk deskripsi (maksimal 4)
				const subCatList = cat.subCategories
					?.map((sub) => sub.name)
					.slice(0, 4)
					.join(", ");

				return (
					<Link
						key={cat.id}
						to="/store"
						search={{ category: cat.slug }}
						className={`group relative border-b border-line py-16 sm:py-24 px-6 md:px-12 flex flex-col justify-between min-h-[420px] bg-paper hover:bg-paper-dim transition-all duration-300 overflow-hidden ${
							shouldFullWidth
								? "sm:col-span-2 sm:border-r-0"
								: "sm:border-r last:sm:border-r-0"
						}`}
					>
						{/* Aksen garis biru di bagian atas kartu */}
						<div className="absolute top-0 left-0 right-0 h-[3px] bg-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

						<div>
							<h2 className="font-head font-black text-4xl sm:text-5xl lg:text-7xl leading-[0.9] text-ink group-hover:text-blue group-hover:-translate-y-1 transition-all duration-300 tracking-tight uppercase break-words max-w-2xl">
								{cat.name}
							</h2>
						</div>

						<div className="mt-12">
							<p className="text-[15px] text-ash max-w-md mb-8 leading-relaxed">
								{cat.subCategories && cat.subCategories.length > 0
									? `Mulai dari ${new Intl.ListFormat("id-ID", {
											style: "long",
											type: "conjunction",
										}).format(
											cat.subCategories.map((s) => s.name),
										)}. Jelajahi seluruh line-up ${cat.name.toLowerCase()} resmi.`
									: `Jelajahi seluruh koleksi ${cat.name.toLowerCase()} resmi.`}
							</p>

							<div className="inline-flex items-center gap-3">
								<span className="text-[12px] font-semibold tracking-widest text-ink group-hover:text-blue transition-colors duration-300">
									/{cat.slug}
								</span>
								<span className="text-sm text-ink group-hover:text-blue transform group-hover:translate-x-2 transition-transform duration-300">
									→
								</span>
							</div>
						</div>
					</Link>
				);
			})}
		</motion.section>
	);
}
