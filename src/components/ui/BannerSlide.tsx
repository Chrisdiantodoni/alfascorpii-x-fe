import { motion } from "motion/react";
import { Button } from "./Button";
import { Image } from "./Image";

export interface BannerFieldSettings {
	title: { position: "left" | "center" | "right"; width: number };
	subtitle: { position: "left" | "center" | "right"; width: number };
	cta_text: { position: "left" | "center" | "right"; width: number };
	gap: number;
	padding_x: number;
	padding_y: number;
}

export interface Banner {
	id: string;
	title: string | null;
	subtitle: string | null;
	imageUrl: string | null;
	clickUrl: string | null;
	ctaText: string | null;
	textColor: string;
	overlay: boolean;
	placement: string;
	orderPosition: number;
	isActive: boolean;
	startDate: string | null;
	endDate: string | null;
	fieldSettings: BannerFieldSettings | null;
}

const DEFAULT_FIELDS: BannerFieldSettings = {
	title: { position: "center", width: 100 },
	subtitle: { position: "center", width: 100 },
	cta_text: { position: "center", width: 56 },
	gap: 8,
	padding_x: 32,
	padding_y: 32,
};

function posClass(pos: "left" | "center" | "right") {
	if (pos === "left") return "text-left mr-auto";
	if (pos === "right") return "text-right ml-auto";
	return "text-center mx-auto";
}

// Konfigurasi animasi stagger & fade-up
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12, // Jeda antar elemen (Title -> Subtitle -> CTA)
			delayChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.1, 0.25, 1],
		},
	},
};

export function BannerSlide({
	banner,
	height,
	heightClass,
	className = "",
}: {
	banner: Banner;
	height?: string;
	heightClass?: string;
	className?: string;
}) {
	const fs: BannerFieldSettings = {
		title: { ...DEFAULT_FIELDS.title, ...banner.fieldSettings?.title },
		subtitle: { ...DEFAULT_FIELDS.subtitle, ...banner.fieldSettings?.subtitle },
		cta_text: { ...DEFAULT_FIELDS.cta_text, ...banner.fieldSettings?.cta_text },
		gap: banner.fieldSettings?.gap ?? DEFAULT_FIELDS.gap,
		padding_x: banner.fieldSettings?.padding_x ?? DEFAULT_FIELDS.padding_x,
		padding_y: banner.fieldSettings?.padding_y ?? DEFAULT_FIELDS.padding_y,
	};
	const { title, subtitle, cta_text: cta } = fs;
	const isLight = banner.textColor === "light";

	const isExternal =
		banner.clickUrl?.startsWith("http://") ||
		banner.clickUrl?.startsWith("https://");

	return (
		<section
			className={`relative overflow-hidden ${heightClass ?? ""} ${className}`}
			style={height ? { height } : undefined}
		>
			{banner.imageUrl ? (
				<>
					<Image
						src={banner.imageUrl}
						alt={banner.title ?? ""}
						className={
							height || heightClass ? "w-full h-full object-cover" : "w-full"
						}
					/>
					{banner.overlay && (
						<div className="absolute inset-0 bg-[rgba(10,10,12,.6)]" />
					)}
				</>
			) : (
				<div className="w-full aspect-[16/9] flex items-center justify-end opacity-[0.06] pr-0 lg:pr-10 pointer-events-none">
					<svg
						viewBox="0 0 400 240"
						className="w-[85%] max-w-[900px]"
						fill="none"
						stroke={isLight ? "#ffffff" : "#0B3D91"}
						strokeWidth="3"
					>
						<circle cx="90" cy="180" r="46" />
						<circle cx="310" cy="180" r="46" />
						<path d="M90 180 L168 88 H244 L310 180" strokeLinejoin="round" />
						<path d="M168 88 L140 180" />
						<path d="M244 88 L226 44 H272" strokeLinecap="round" />
					</svg>
				</div>
			)}

			{/* Container Animasi Utama */}
			<motion.div
				key={banner.id} // Memastikan animasi ter-trigger ulang saat banner diganti
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="absolute inset-0 flex flex-col justify-center w-full z-10"
				style={{
					padding: `${fs.padding_y}px ${fs.padding_x}px`,
				}}
			>
				{banner.title && (
					<motion.div
						variants={itemVariants}
						className={posClass(title?.position)}
						style={{
							width: `${title.width}%`,
							marginBottom: fs.gap,
						}}
					>
						<div
							className={`font-head font-black tracking-tight ${
								isLight ? "text-white" : "text-ink"
							} [&>*]:text-[clamp(1.5rem,4.5vw,4rem)] [&>*]:leading-[1.1]`}
							dangerouslySetInnerHTML={{
								__html: banner.title,
							}}
						/>
					</motion.div>
				)}

				{banner.subtitle && (
					<motion.div
						variants={itemVariants}
						className={posClass(subtitle?.position)}
						style={{
							width: `${subtitle.width}%`,
							marginBottom: fs.gap,
						}}
					>
						<div
							className={`text-[17px] md:text-[20px] ${
								isLight ? "text-white/80" : "text-ash"
							} [&>*]:mb-0`}
							dangerouslySetInnerHTML={{
								__html: banner.subtitle,
							}}
						/>
					</motion.div>
				)}

				{banner.ctaText && banner.clickUrl && (
					<motion.div
						variants={itemVariants}
						className={posClass(cta?.position)}
						style={{ width: `${cta.width}%` }}
					>
						{isExternal ? (
							<Button
								variant={isLight ? "light" : "primary"}
								href={banner.clickUrl}
								external
							>
								{banner.ctaText}
							</Button>
						) : (
							<Button
								variant={isLight ? "light" : "primary"}
								to={banner.clickUrl}
							>
								{banner.ctaText}
							</Button>
						)}
					</motion.div>
				)}
			</motion.div>
		</section>
	);
}
