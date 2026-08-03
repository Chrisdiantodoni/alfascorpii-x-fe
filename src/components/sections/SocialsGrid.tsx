import { Autoplay, Navigation } from "swiper/modules";
// Import Swiper React & CSS
import { Swiper, SwiperSlide } from "swiper/react";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { Section } from "#/components/ui/Section";
import { SectionLabel } from "#/components/ui/SectionLabel";
import { cms } from "#/data/cms";
import "swiper/css";
import "swiper/css/navigation";

// Satu item social post. Nama platform disamakan dengan key di
// `socialBadges` & `cms.contact.socialMedia` ("instagram", bukan "IG")
// supaya lookup badge & link tidak pernah mismatch.
export interface SocialItem {
	id: string | number;
	platform: "tiktok" | "instagram" | "youtube";
	title: string;
	likesFormatted: string;
	url: string;
	thumbnailUrl: string;
	mediaType?: "video" | "image" | "carousel";
	author?: string;
	commentsFormatted?: string;
	sharesFormatted?: string;
	viewsFormatted?: string;
}

interface SocialsGridProps {
	socials: SocialItem[];
}

export default function SocialsGrid({ socials }: SocialsGridProps) {
	const socialBadges: Record<string, { label: string; bg: string }> = {
		instagram: { label: "IG", bg: "bg-pink-600" },
		tiktok: { label: "TIKTOK", bg: "bg-black border border-white/20" },
		youtube: { label: "YT", bg: "bg-red-600" },
	};

	return (
		<Section animate>
			<SectionLabel className="text-center mb-10">
				AKTIVITAS DI MEDIA SOSIAL
			</SectionLabel>

			<div className="relative group/swiper px-2">
				<Swiper
					modules={[Navigation, Autoplay]}
					spaceBetween={16}
					slidesPerView={1.2}
					navigation={{
						nextEl: ".swiper-button-next-custom",
						prevEl: ".swiper-button-prev-custom",
					}}
					autoplay={{ delay: 4000, disableOnInteraction: false }}
					breakpoints={{
						640: { slidesPerView: 2, spaceBetween: 20 },
						1024: { slidesPerView: 3, spaceBetween: 24 },
					}}
					className="w-full !pb-4"
				>
					{socials.map((s) => {
						const badge = socialBadges[s.platform] || {
							label: s.platform.toUpperCase(),
							bg: "bg-blue",
						};

						// Deteksi jenis konten (default ke 'video' jika belum ditentukan)
						const contentType = s.mediaType || "video";
						const isVideo = contentType === "video";
						const isCarousel = contentType === "carousel";

						return (
							<SwiperSlide key={s.id}>
								<a
									href={s.url}
									target="_blank"
									rel="noopener noreferrer"
									/* Menghapus aspect-[2/3] agar tinggi menyesuaikan gambar secara alami */
									className="group relative block w-full overflow-hidden bg-paper-dim border border-line hover:border-blue/60 transition-all duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
								>
									<div className="relative aspect-[2/3] w-full overflow-hidden bg-paper-dim">
										<img
											src={s.thumbnailUrl}
											alt={s.title}
											loading="lazy"
											className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
										/>
									</div>

									{/* Badge Platform & Indicator Type */}
									<div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
										<span
											className={`text-[9px] font-bold tracking-widest px-2 py-0.5 rounded text-white shadow-md ${badge.bg}`}
										>
											{badge.label}
										</span>

										{/* Badge Tambahan untuk Carousel/Album */}
										{isCarousel && (
											<span className="bg-black/70 backdrop-blur-md text-white p-1 rounded flex items-center justify-center shadow-md">
												<MaterialIcon
													name="collections"
													className="!text-[12px]"
												/>
											</span>
										)}
									</div>

									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

									{/* Hover Icon Overlay Center (Dynamic Sesuai Tipe) */}
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
										<div className="w-12 h-12 rounded-full bg-blue/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
											<MaterialIcon
												name={
													isVideo
														? "play_arrow"
														: isCarousel
															? "collections"
															: "visibility"
												}
												className="!text-[22px]"
											/>
										</div>
									</div>

									{/* Content Overlay */}
									<div className="absolute inset-x-0 bottom-0 p-4 z-10 flex flex-col justify-end translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
										<p className="text-[12px] text-white font-medium line-clamp-2 leading-snug drop-shadow-sm">
											{s.title}
										</p>

										<div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-[11px] text-white/70">
											<span className="flex items-center gap-1 text-red-400">
												<MaterialIcon
													name="favorite"
													className="!text-[13px]"
												/>
												{s.likesFormatted}
											</span>

											{/* CTA Text Dynamic */}
											<span className="text-[9px] font-semibold tracking-wider text-white/50 uppercase group-hover:text-blue transition-colors">
												{isVideo ? "TONTON →" : "LIHAT →"}
											</span>
										</div>
									</div>
								</a>
							</SwiperSlide>
						);
					})}
				</Swiper>

				{/* Custom Navigation Buttons */}
				<button
					type="button"
					aria-label="Previous Slide"
					className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/swiper:opacity-100 transition-opacity duration-300 hover:bg-blue hover:border-blue disabled:opacity-0"
				>
					<MaterialIcon name="chevron_left" className="!text-[24px]" />
				</button>

				<button
					type="button"
					aria-label="Next Slide"
					className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/swiper:opacity-100 transition-opacity duration-300 hover:bg-blue hover:border-blue disabled:opacity-0"
				>
					<MaterialIcon name="chevron_right" className="!text-[24px]" />
				</button>
			</div>

			{/* Social Links Footer */}
			<div className="flex justify-center gap-8 mt-10 text-[12px] tracking-widest">
				{["TIKTOK", "INSTAGRAM", "YOUTUBE"].map((label) => {
					const key =
						label.toLowerCase() as keyof typeof cms.contact.socialMedia;
					const url = cms.contact.socialMedia[key];
					if (!url) return null;
					return (
						<a
							key={label}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue transition-colors flex items-center gap-1.5 group"
						>
							<span>{label}</span>
							<span className="text-[10px] text-ash group-hover:text-blue group-hover:translate-x-0.5 transition-all">
								↗
							</span>
						</a>
					);
				})}
			</div>
		</Section>
	);
}
