import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { useCartStore } from "#/stores/cart";

interface TopbarProps {
	onMenuToggle: () => void;
	onCartToggle: () => void;
	menuOpen: boolean;
	transparent?: boolean;
}

export default function Topbar({
	onMenuToggle,
	onCartToggle,
	menuOpen,
	transparent,
}: TopbarProps) {
	const totalItems = useCartStore((s) => s.totalItems());
	const [hydrated, setHydrated] = useState(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	useEffect(() => setHydrated(true), []);

	const linkColor = (active: boolean) =>
		active ? "text-blue-bright" : transparent ? "text-white/80" : "text-ink";

	return (
		<nav
			id="topbar"
			className={`fixed top-0 inset-x-0 z-50 px-6 md:px-16 py-6 border-b ${
				transparent ? "nav-transparent" : ""
			}`}
		>
			<div className="max-w-[1920px] mx-auto flex items-center justify-between">
				<Link
					to="/"
					className={`font-head font-extrabold text-lg tracking-tight transition-colors ${linkColor(pathname === "/")}`}
				>
					ALFA SCORPII X
				</Link>
				<div className="flex items-center gap-5 md:gap-7">
					<Link
						to="/"
						className={`text-[11px] font-semibold tracking-widest hover:text-blue-bright transition-colors ${linkColor(pathname === "/")}`}
					>
						BERANDA
					</Link>
					<Link
						to="/store"
						className={`text-[11px] font-semibold tracking-widest hover:text-blue-bright transition-colors ${linkColor(pathname.startsWith("/store"))}`}
					>
						TOKO
					</Link>
					<Link
						to="/login"
						className={`flex items-center gap-1.5 hover:text-blue-bright transition-colors ${linkColor(pathname.startsWith("/login"))}`}
					>
						<MaterialIcon name="person" className="!text-[22px]" />
						<span className="hidden md:inline text-[11px] font-semibold tracking-widest">
							MASUK
						</span>
					</Link>
					<button
						id="cartTrig"
						type="button"
						aria-label="Keranjang"
						onClick={onCartToggle}
						className={`relative hover:text-blue-bright transition-colors ${
							transparent ? "text-white/80" : "text-ink"
						}`}
					>
						<MaterialIcon name="shopping_cart" className="!text-[22px]" />
						{hydrated && totalItems > 0 && (
							<span className="absolute -top-[6px] -right-[8px] min-w-[16px] h-[16px] px-[4px] rounded-full bg-blue-bright text-white text-[10px] font-bold flex items-center justify-center leading-none">
								{totalItems}
							</span>
						)}
					</button>
					<button
						id="menuToggle"
						type="button"
						aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
						aria-expanded={menuOpen}
						onClick={onMenuToggle}
						className="flex items-center gap-[10px]"
					>
						<span
							className={`hidden sm:inline-block text-right w-[56px] text-[11px] font-semibold tracking-[0.2em] transition-colors ${
								menuOpen || transparent ? "text-white" : "text-ink"
							}`}
						>
							{menuOpen ? "TUTUP" : "MENU"}
						</span>
						<span className="w-[26px] h-[16px] relative block overflow-hidden">
							{/* Garis Atas */}
							<span
								className={`absolute left-0 right-0 h-[2px] block transition-all duration-300 ${
									menuOpen ? "top-[7px] rotate-45" : "top-0"
								} ${menuOpen || transparent ? "bg-white" : "bg-ink"}`}
							/>

							{/* Garis Bawah */}
							<span
								className={`absolute left-0 right-0 h-[2px] block transition-all duration-300 ${
									menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
								} ${menuOpen || transparent ? "bg-white" : "bg-ink"}`}
							/>
						</span>
					</button>
				</div>
			</div>
		</nav>
	);
}
