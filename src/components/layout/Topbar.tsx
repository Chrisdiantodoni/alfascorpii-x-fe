import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { useSession } from "#/lib/auth-client";
import { useCartStore } from "#/stores/cart";
import type { CategoryRef, MenuData, PageRef } from "#/types/menu";
import type { Category } from "#/types";

interface TopbarProps {
  onMenuToggle: () => void;
  onCartToggle: () => void;
  menuOpen: boolean;
  transparent?: boolean;
  menu: MenuData[];
  categories: Category[];
}

const navLinkClasses =
  "text-[12px] font-bold tracking-widest transition-all duration-200 uppercase";

export default function Topbar({
  onMenuToggle,
  onCartToggle,
  menuOpen,
  transparent,
  menu,
  categories,
}: TopbarProps) {
  const totalItems = useCartStore((s) => s.totalItems());
  const { data: session } = useSession();
  const [hydrated, setHydrated] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setHydrated(true), []);

  // PERBAIKAN: isTransparent murni mengikuti prop transparent
  const isTransparent = Boolean(transparent);

  const linkColor = (active: boolean) =>
    active ? "text-blue-bright" : isTransparent ? "text-white/80" : "text-ink";

  const headerItems =
    menu.find((m) => m.location === "header")?.menuItems ??
    menu[0]?.menuItems ??
    [];
  const dynamicItems = headerItems.filter((item) => item.isActive);

  return (
    <nav
      id="topbar"
      className={`fixed top-0 inset-x-0 z-50 px-6 md:px-16 py-6 border-b transition-all duration-300  ${
        isTransparent ? "nav-transparent" : "bg-white border-black/5"
      }`}
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        <Link
          resetScroll={false}

          to="/"
          className={`font-head  font-extrabold text-lg tracking-tight transition-colors uppercase ${linkColor(
            pathname === "/",
          )}`}
        >
          ALFA SCORPII X
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          <div
            className="hidden lg:flex items-center gap-8 "
            suppressHydrationWarning
          >
            <Link
              resetScroll={false}
              to="/"
              className={`${navLinkClasses} ${linkColor(pathname === "/")}`}
            >
              BERANDA
            </Link>

            <HoverDropdown
              trigger={
                <Link
                  resetScroll={false}

                  to="/store"
                  className={`${navLinkClasses} hover:text-blue-bright transition-colors  ${linkColor(
                    pathname.startsWith("/store"),
                  )} cursor-pointer`}
                >
                  TOKO
                </Link>
              }
            >
              <div className="w-full">
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <CategoryRow key={cat.id} category={cat} />
                  ))}
              </div>
            </HoverDropdown>

            {dynamicItems
              .filter((filter) => filter.type !== "category")
              .map((item) => (
                <DynamicNavItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  linkColor={linkColor}
                />
              ))}
          </div>

          <motion.button
            id="cartTrig"
            type="button"
            aria-label="Keranjang"
            onClick={onCartToggle}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className={`relative hover:text-blue-bright transition-colors ${
              isTransparent ? "text-white/80" : "text-ink"
            }`}
          >
            <MaterialIcon name="shopping_cart" className="!text-[22px]" />

            <AnimatePresence mode="popLayout">
              {hydrated && totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [1, 1.4, 0.95, 1.1, 1],
                    rotate: [0, -12, 12, -6, 0],
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute -top-[6px] -right-[8px] min-w-[16px] h-[16px] px-[4px] rounded-full bg-blue-bright text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-sm"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {session ? (
            <Link
              resetScroll={false}

              to="/user"
              className={`flex items-center gap-1.5 hover:text-blue-bright transition-colors ${linkColor(
                pathname.startsWith("/user"),
              )}`}
            >
              <MaterialIcon name="person" className="!text-[22px]" />
              <span className="hidden md:inline text-[11px] font-semibold tracking-widest uppercase">
                AKUN
              </span>
            </Link>
          ) : (
            <Link
              resetScroll={false}

              to="/login"
              className={`flex items-center gap-1.5 hover:text-blue-bright transition-colors ${linkColor(
                pathname.startsWith("/login"),
              )}`}
            >
              <MaterialIcon name="person" className="!text-[22px]" />
              <span className="hidden md:inline text-[12px] font-semibold tracking-widest uppercase">
                MASUK
              </span>
            </Link>
          )}

          <motion.button
            id="menuToggle"
            type="button"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            onClick={onMenuToggle}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-[10px] lg:hidden"
          >
            {/*<span
              className={`hidden sm:inline-block text-right w-[56px] text-[11px] font-semibold tracking-[0.2em] transition-colors uppercase ${
                menuOpen || isTransparent ? "text-white" : "text-ink"
              }`}
            >
              {menuOpen ? "TUTUP" : "MENU"}
            </span>*/}
            <span className="w-[26px] h-[16px] relative block overflow-hidden">
              <span
                className={`absolute left-0 right-0 h-[2px] block transition-all duration-300 ${
                  menuOpen ? "top-[7px] rotate-45" : "top-0"
                } ${menuOpen || isTransparent ? "bg-white" : "bg-ink"}`}
              />
              <span
                className={`absolute left-0 right-0 h-[2px] block transition-all duration-300 ${
                  menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
                } ${menuOpen || isTransparent ? "bg-white" : "bg-ink"}`}
              />
            </span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

function HoverDropdown({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    // 'flex items-center' ensures the baseline perfectly matches adjacent Link components
    <div className="relative group/nav flex items-center">
      {trigger}
      {/*
        Removed pt-4. Using mt-5 and a 'before:absolute' block to create an invisible bridge.
        This prevents padding layout quirks from misaligning the topnav flex items.
      */}
      {/*<div className="absolute left-1/2 -translate-x-1/2 top-full mt-5 opacity-0 invisible translate-y-1 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-200 z-50 before:absolute before:-top-5 before:left-0 before:w-full before:h-5">
        <div className="bg-white text-ink rounded-xl shadow-xl border border-black/5 py-3 min-w-[220px]">
          {children}
        </div>
      </div>*/}

      <div className="absolute left-0 top-full mt-5 opacity-0 invisible translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-200 z-50 before:absolute before:-top-5 before:left-0 before:w-full before:h-5">
        <div className="bg-white text-ink rounded-xl shadow-xl border border-black/5 py-3 min-w-[220px]">
          {children}
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ category }: { category: CategoryRef }) {
  const hasSub = !!category.subCategories?.length;

  return (
    <div className="relative group/cat">
      <Link
        resetScroll={false}

        to="/category/$slug"
        params={{ slug: category.slug }}
        className="flex items-center justify-between gap-6 px-5 py-2.5 text-[12px] font-semibold tracking-wide hover:bg-black/[.03] hover:text-blue-bright transition-colors uppercase"
      >
        {category.name}
        {hasSub && <span className="text-[10px] opacity-50">›</span>}
      </Link>

      {hasSub && (
        <div className="absolute left-full top-0 ml-2 opacity-0 invisible translate-x-1 group-hover/cat:opacity-100 group-hover/cat:visible group-hover/cat:translate-x-0 transition-all duration-200 z-50 before:absolute before:-left-2 before:top-0 before:w-2 before:h-full">
          <div className="bg-white text-ink rounded-xl shadow-xl border border-black/5 py-3 min-w-[220px]">
            {category.subCategories?.map((sc) => (
              <Link
                resetScroll={false}

                key={sc.id}
                to="/sub-category/$slug"
                params={{ slug: sc.slug }}
                className="block px-5 py-2.5 text-[12px] tracking-wide hover:bg-black/[.03] hover:text-blue-bright transition-colors uppercase"
              >
                {sc.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DynamicNavItem({
  item,
  pathname,
  linkColor,
}: {
  item: MenuData["menuItems"][number];
  pathname: string;
  linkColor: (active: boolean) => string;
}) {
  const label =
    item.label ??
    (item.type === "page"
      ? (item.reference as PageRef | null)?.title
      : ((item.reference as { name?: string; title?: string } | null)?.name ??
        (item.reference as { title?: string } | null)?.title)) ??
    "";

  if (item.type === "page" && item.reference) {
    const page = item.reference as PageRef;
    return (
      <Link
        resetScroll={false}

        to="/$slug"
        params={{ slug: page.slug }}
        className={`${navLinkClasses} hover:text-blue-bright transition-colors  ${linkColor(pathname === `/${page.slug}`)}`}
      >
        {label}
      </Link>
    );
  }

  if (item.type === "product" && item.reference) {
    const product = item.reference as { slug: string };
    return (
      <Link
        resetScroll={false}

        to="/product/$slug"
        params={{ slug: product.slug }}
        className={`${navLinkClasses} hover:text-blue-bright transition-colors  ${linkColor(
          pathname === `/product/${product.slug}`,
        )}`}
      >
        {label}
      </Link>
    );
  }

  if (item.url) {
    return (
      <Link
        resetScroll={false}

        to={item.url}
        className={`${navLinkClasses} hover:text-blue-bright transition-colors  ${linkColor(pathname === item.url)}`}
      >
        {label}
      </Link>
    );
  }

  return (
    <span className={`${navLinkClasses} ${linkColor(false)}`}>{label}</span>
  );
}
