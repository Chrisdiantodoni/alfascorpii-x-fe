import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { cms } from "#/data/cms";
import type {
	CategoryRef,
	ContactSettings,
	MenuData,
	PageRef,
} from "#/types/menu";
import { ThemeToggle } from "../ThemeToggle";

interface OverlayNavProps {
	open: boolean;
	onClose: () => void;
	menu: MenuData[];
	contact: ContactSettings;
}

function MagneticLink({ platform, url }: { platform: string; url: string }) {
	const ref = useRef<HTMLAnchorElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	return (
		<motion.a
			ref={ref}
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			animate={{ x: position.x, y: position.y }}
			transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
			className="relative px-4 py-2 text-[12px] tracking-widest text-white/60 hover:text-white uppercase transition-colors group"
		>
			<span className="relative z-10 flex items-center gap-1.5">
				<span className="inline-block w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-blue-bright group-hover:scale-125 transition-all duration-300" />
				{platform}
			</span>
			<span className="absolute inset-0 rounded-lg bg-white/5 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
		</motion.a>
	);
}

const staggerList = {
	hidden: {},
	show: { transition: { delayChildren: 0.35, staggerChildren: 0.12 } },
};

const staggerItem = {
	hidden: { opacity: 0, x: -40 },
	show: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

export default function OverlayNav({
	open,
	onClose,
	menu,
	contact,
}: OverlayNavProps) {
	const items =
		menu.find((m) => m.location === "header")?.menuItems ??
		menu[0]?.menuItems ??
		[];
	const activeItems = items.filter((item) => item.isActive);

	return (
		<div
			className={`fixed inset-0 z-40 bg-[#0A0A0C] text-white flex flex-col overflow-hidden transition-transform duration-[550ms] ease-[cubic-bezier(.77,0,.18,1)] ${
				open
					? "translate-y-0 pointer-events-auto"
					: "-translate-y-full pointer-events-none"
			}`}
			aria-hidden={!open}
		>
			<div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 pt-28 md:pt-32 px-6 md:px-16 gap-10 overflow-y-auto max-w-[1920px] mx-auto w-full">
				<motion.div
					key={open ? "open" : "closed"}
					variants={staggerList}
					initial="hidden"
					animate="show"
					className="lg:col-span-7 flex flex-col justify-center"
				>
					{activeItems.map((item, i) => {
						const num = String(i + 1).padStart(2, "0");
						const label =
							item.label ??
							(item.type === "category"
								? (item.reference as CategoryRef | null)?.name
								: (item.reference as PageRef | null)?.title) ??
							"";
						const catRef =
							item.type === "category"
								? (item.reference as CategoryRef | null)
								: null;
						const hasDropdown =
							catRef?.subCategories && catRef.subCategories.length > 0;

						const linkClasses =
							"flex items-center justify-between py-4 md:py-5 hover:text-blue-bright transition-colors";

						const numAndLabel = (
							<span className="flex items-baseline gap-4">
								<span className="text-xs font-mono text-blue-bright">
									{num}
								</span>
								<span className="font-head font-black text-3xl sm:text-4xl md:text-6xl tracking-tight">
									{label}
								</span>
							</span>
						);

						let linkEl: React.ReactNode;
						if (item.type === "category" && item.reference) {
							linkEl = (
								<Link
									to="/category/$slug"
									params={{ slug: item.reference.slug }}
									onClick={onClose}
									className={linkClasses}
								>
									{numAndLabel}
									{hasDropdown && (
										<span className="text-[26px] font-light transition-transform duration-250 group-hover:rotate-45 group-hover:text-blue-bright">
											+
										</span>
									)}
								</Link>
							);
						} else if (item.type === "page" && item.reference) {
							linkEl = (
								<Link
									to="/$slug"
									params={{ slug: item.reference.slug }}
									onClick={onClose}
									className={linkClasses}
								>
									{numAndLabel}
								</Link>
							);
						} else if (item.type === "product" && item.reference) {
							linkEl = (
								<Link
									to="/product/$slug"
									params={{ slug: item.reference.slug }}
									onClick={onClose}
									className={linkClasses}
								>
									{numAndLabel}
								</Link>
							);
						} else if (item.url) {
							linkEl = (
								<Link
									key={item.id}
									to={item.url}
									onClick={onClose}
									className={linkClasses}
								>
									{numAndLabel}
								</Link>
							);
						} else {
							linkEl = <span className={linkClasses}>{numAndLabel}</span>;
						}

						return (
							<motion.div
								variants={staggerItem}
								className="border-b border-white/12 group"
								key={item.id}
							>
								{linkEl}
								{hasDropdown && (
									<div className="max-h-0 group-hover:max-h-[300px] overflow-hidden transition-all duration-350">
										<div className="pb-6 pl-0 md:pl-16 flex flex-wrap gap-x-10 gap-y-3">
											{catRef!.subCategories!.map((sc) => (
												<Link
													key={sc.id}
													to="/sub-category/$slug"
													params={{
														slug: sc.slug,
													}}
													onClick={onClose}
													className="text-sm tracking-widest text-white/80 hover:text-blue-bright transition-colors"
												>
													{sc.name.toUpperCase()}
													{sc.products?.length ? (
														<span className="block text-[10px] text-white/40 font-normal normal-case">
															{sc.products.map((p) => p.name).join(" · ")}
														</span>
													) : null}
												</Link>
											))}
										</div>
									</div>
								)}
							</motion.div>
						);
					})}
				</motion.div>

				<div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
					<div
						className="absolute inset-0 rounded-full"
						style={{
							background:
								"radial-gradient(circle at 50% 50%, rgba(31,95,224,.18), transparent 65%)",
						}}
					/>
					<svg
						viewBox="0 0 460 300"
						className="w-full max-w-[480px] relative"
						fill="none"
						stroke="#1F5FE0"
						strokeWidth="2.2"
					>
						<title>Ilustrasi motor</title>
						<path d="M20 90 H140" strokeOpacity=".35" />
						<path d="M10 110 H120" strokeOpacity=".55" />
						<path d="M25 130 H150" strokeOpacity=".35" />
						<circle cx="120" cy="220" r="52" />
						<circle cx="120" cy="220" r="8" fill="#1F5FE0" />
						<circle cx="340" cy="220" r="52" />
						<circle cx="340" cy="220" r="8" fill="#1F5FE0" />
						<path
							d="M120 220 L205 120 H300 L340 220"
							strokeLinejoin="round"
							strokeWidth="3"
						/>
						<path d="M205 120 L175 220" strokeWidth="2.4" />
						<path
							d="M300 120 L282 70 H330"
							strokeLinecap="round"
							strokeWidth="2.4"
						/>
						<path d="M300 120 L320 140" strokeWidth="2.4" />
						<path d="M175 220 H265" strokeWidth="2" strokeOpacity=".6" />
						<circle cx="230" cy="150" r="10" fill="#0A0A0C" opacity=".5" />
					</svg>
				</div>
			</div>

			<div className="border-t border-white/10 px-6 md:px-16 py-6 max-w-[1920px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
				<div className="flex flex-wrap items-center gap-2">
					{Object.entries(contact.social_media).map(([platform, url]) => {
						if (!url) return null;
						return (
							<MagneticLink key={platform} platform={platform} url={url} />
						);
					})}
				</div>
				<ThemeToggle />
			</div>
		</div>
	);
}
