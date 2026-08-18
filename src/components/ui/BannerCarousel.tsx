import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { type Banner, BannerSlide } from "./BannerSlide";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface BannerCarouselProps {
	banners: Banner[];
	height?: string;
	heightClass?: string;
	autoRotate?: number;
	className?: string;
}

export function BannerCarousel({
	banners,
	height,
	heightClass,
	autoRotate = 0,
	className = "",
}: BannerCarouselProps) {
	// Ganti useRef dengan useState / Callback Ref
	const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
	const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
	const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);

	if (banners.length === 0) return null;

	if (banners.length === 1) {
		return (
			<BannerSlide
				banner={banners[0]}
				height={height}
				heightClass={heightClass}
				className={className}
			/>
		);
	}

	return (
		<section className={`relative ${className}`}>
			<Swiper
				modules={[Autoplay, EffectFade, Navigation, Pagination]}
				effect="fade"
				fadeEffect={{ crossFade: true }}
				autoHeight={!height && !heightClass}
				autoplay={
					autoRotate > 0
						? { delay: autoRotate, disableOnInteraction: false }
						: false
				}
				navigation={{
					prevEl,
					nextEl,
				}}
				pagination={{
					el: paginationEl,
					clickable: true,
				}}
				loop
				className="w-full banner-swiper"
			>
				{banners.map((banner) => (
					<SwiperSlide key={banner.id}>
						<BannerSlide
							banner={banner}
							height={height}
							heightClass={heightClass}
						/>
					</SwiperSlide>
				))}
			</Swiper>

			{/* Sambungkan elemen ke state via callback ref */}
			<button
				type="button"
				ref={setPrevEl}
				className="banner-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
				aria-label="Slide sebelumnya"
			>
				<MaterialIcon name="arrow_back" className="!text-[22px]" />
			</button>
			<button
				type="button"
				ref={setNextEl}
				className="banner-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
				aria-label="Slide berikutnya"
			>
				<MaterialIcon name="arrow_forward" className="!text-[22px]" />
			</button>

			<div ref={setPaginationEl} className="banner-pagination z-20 relative" />
		</section>
	);
}

/* ====================================================================
OLD CUSTOM CAROUSEL — keep as reference, already replaced by Swiper
====================================================================
import { useState, useEffect } from "react";
import { BannerSlide, type Banner } from "./BannerSlide";
import { MaterialIcon } from "#/components/ui/MaterialIcon";

interface BannerCarouselProps {
	banners: Banner[];
	height?: string;
	autoRotate?: number;
	className?: string;
}

export function BannerCarousel({
	banners,
	height = "92vh",
	autoRotate = 0,
	className = "",
}: BannerCarouselProps) {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);

	const active = banners;

	useEffect(() => {
		if (active.length <= 1 || autoRotate <= 0 || paused) return;
		const timer = setInterval(() => {
			setCurrent((prev) => (prev + 1) % active.length);
		}, autoRotate);
		return () => clearInterval(timer);
	}, [active.length, autoRotate, paused]);

	const prev = () =>
		setCurrent((c) => (c - 1 + active.length) % active.length);
	const next = () =>
		setCurrent((c) => (c + 1) % active.length);

	if (active.length === 0) return null;

	if (active.length === 1) {
		return (
			<BannerSlide
				banner={active[0]}
				height={height}
				className={className}
			/>
		);
	}

	return (
		<section
			className={`relative overflow-hidden ${className}`}
			style={{ height }}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			{active.map((banner, i) => (
				<div
					key={banner.id}
					className={`absolute inset-0 transition-opacity duration-600 ${
						i === current
							? "opacity-100 z-10"
							: "opacity-0 z-0 pointer-events-none"
					}`}
				>
					<BannerSlide banner={banner} height="100%" className="px-14" />
				</div>
			))}

			<button type="button" onClick={prev}
				className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
				aria-label="Slide sebelumnya">
				<MaterialIcon name="arrow_back" className="!text-[22px]" />
			</button>
			<button type="button" onClick={next}
				className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 hover:scale-110 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
				aria-label="Slide berikutnya">
				<MaterialIcon name="arrow_forward" className="!text-[22px]" />
			</button>

			<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
				{active.map((_, i) => (
					<button key={i} type="button" onClick={() => setCurrent(i)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							i === current
								? "bg-white scale-110"
								: "bg-white/50 hover:bg-white/75"
						}`}
						aria-label={`Slide ${i + 1}`} />
				))}
			</div>
		</section>
	);
}
==================================================================== */
