import {
  createFileRoute,
  Outlet,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import CartDrawer from "#/components/cart/CartDrawer";
import Footer from "#/components/layout/Footer";
import OverlayNav from "#/components/layout/OverlayNav";
import Topbar from "#/components/layout/Topbar";
import WhatsAppFloat from "#/components/layout/WhatsAppFloat";
import { getBanners } from "#/server/cms";
import { getCategories, getLayoutData } from "#/server/master";
import { useCartStore } from "#/stores/cart";
import { useWishlistStore } from "#/stores/wishlist";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { RouteAnimationContainer } from "#/components/RouteAnimationContainer";
import type { Category } from "#/types";
import SplashScreenWrapper from "#/components/SplashScreenWrapper";
import SplashScreen from "#/components/SplashScreen";
import { PageNotFound } from "#/components/PageNotFound";

export const Route = createFileRoute("/_public")({
  loader: async ({ location }) => {
    const [res, banners] = await Promise.all([
      getLayoutData(),
      getBanners({ data: { pathname: location.pathname } }),
    ]);
    return { menu: res.newMenus, contact: res.contact, banners };
  },
  notFoundComponent: PageNotFound,

  component: PublicLayout,
});

function PublicLayout() {
  const { menu, contact, banners } = Route.useLoaderData();
  const router = useRouter();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const hasHeroBanner = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [heroTransparent, setHeroTransparent] = useState(hasHeroBanner);

  useEffect(() => {
    useWishlistStore.getState().load();
  }, []);

  useEffect(() => {
    const topbar = document.getElementById("topbar");

    const handler = () => {
      const scrolled = window.scrollY > 24;
      if (topbar) topbar.classList.toggle("scrolled", scrolled);
      setHeroTransparent(hasHeroBanner && window.scrollY < 80);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [hasHeroBanner]);

  useEffect(() => {
    if (menuOpen) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMenuOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [menuOpen]);

  const navbar = menu.find((find) => find.location === "navbar");

  const categories = navbar?.menuItems
    .filter((filt) => filt.type === "category")
    .flatMap((item) => ({
      ...item.reference,
    })) as Category[];

  useEffect(() => {
    // 768px adalah batas breakpoint 'md' pada Tailwind
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      // Jika layar menjadi lebih lebar dari 768px (Desktop mode), tutup menu
      if (e.matches) {
        setMenuOpen(false);
      }
    };

    // Tambahkan event listener untuk memantau perubahan ukuran layar
    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup listener saat komponen di-unmount
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);
  console.log(menu, categories);

  return (
    <>
      <Topbar
        categories={categories}
        menu={menu}
        menuOpen={menuOpen}
        transparent={heroTransparent || menuOpen}
        onMenuToggle={() => setMenuOpen((prev) => !prev)}
        onCartToggle={useCartStore((s) => s.toggleCart)}
      />
      <OverlayNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        menu={menu}
        categories={categories}
        contact={contact}
      />
      <main className="px-6 md:px-16  mx-auto">
        <LayoutGroup id="page-layout">
          <RouteAnimationContainer>
            {/*<SplashScreenWrapper showSplash>*/}
            <Outlet />
            {/*</SplashScreenWrapper>*/}
          </RouteAnimationContainer>
        </LayoutGroup>
      </main>
      <Footer contact={contact} menu={menu} />
      <CartDrawer />
      <WhatsAppFloat contact={contact} />
    </>
  );
}
