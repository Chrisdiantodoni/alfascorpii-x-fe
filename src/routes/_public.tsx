import {
	createFileRoute,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import CartDrawer from "#/components/cart/CartDrawer";
import Footer from "#/components/layout/Footer";
import OverlayNav from "#/components/layout/OverlayNav";
import Topbar from "#/components/layout/Topbar";
import WhatsAppFloat from "#/components/layout/WhatsAppFloat";
import { getBanners } from "#/server/cms";
import { getLayoutData } from "#/server/master";

export const Route = createFileRoute("/_public")({
	loader: async ({ location }) => {
		const [res, banners] = await Promise.all([
			getLayoutData(),
			getBanners({ data: { pathname: location.pathname } }),
		]);
		return { menu: res.newMenus, contact: res.contact, banners };
	},
	component: PublicLayout,
});

function PublicLayout() {
	const { menu, contact } = Route.useLoaderData();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isHome = pathname === "/";
	const [menuOpen, setMenuOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [heroTransparent, setHeroTransparent] = useState(isHome);

	useEffect(() => {
		const topbar = document.getElementById("topbar");

		const handler = () => {
			const scrolled = window.scrollY > 24;
			if (topbar) topbar.classList.toggle("scrolled", scrolled);
			setHeroTransparent(isHome && window.scrollY < 80);
		};

		handler();
		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, [isHome]);

	useEffect(() => {
		if (menuOpen) {
			const onKey = (e: KeyboardEvent) => {
				if (e.key === "Escape") setMenuOpen(false);
			};
			document.addEventListener("keydown", onKey);
			return () => document.removeEventListener("keydown", onKey);
		}
	}, [menuOpen]);

	return (
		<>
			<Topbar
				menuOpen={menuOpen}
				transparent={heroTransparent || menuOpen}
				onMenuToggle={() => setMenuOpen((prev) => !prev)}
				onCartToggle={() => setCartOpen(true)}
			/>
			<OverlayNav
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				menu={menu}
				contact={contact}
			/>
			<main className="px-6 md:px-16 max-w-[1920px] mx-auto">
				<Outlet />
			</main>
			<Footer contact={contact} menu={menu} />
			<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
			<WhatsAppFloat contact={contact} />
		</>
	);
}
