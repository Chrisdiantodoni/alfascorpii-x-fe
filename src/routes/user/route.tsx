// owned by: italfa:staff
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import type { Session } from "better-auth";
import {
  ArrowLeft,
  Heart,
  Home,
  LogOut,
  Shield,
  Store,
  User as UserIcon,
  Settings,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import { signOut } from "#/lib/auth-client";
import { getSession } from "#/server/session";
import Topbar from "#/components/layout/Topbar";
import OverlayNav from "#/components/layout/OverlayNav";
import { getLayoutData } from "#/server/master";
import { useCartStore } from "#/stores/cart";

export const Route = createFileRoute("/user")({
  loader: async () => {
    const [res, session] = await Promise.all([getLayoutData(), getSession()]);
    if (!session?.user) {
      throw redirect({ to: "/login" });
    }
    return { session, menu: res.newMenus, contact: res.contact };
  },
  component: UserLayout,
});

const UserSessionContext = createContext<Session | null>(null);

export function useUserSession() {
  return useContext(UserSessionContext);
}

const navItems = [
  { to: "/user", label: "Ringkasan", icon: Home, exact: true },
  { to: "/user/profile", label: "Profil", icon: UserIcon },
  { to: "/user/security", label: "Keamanan", icon: Shield },
  { to: "/user/wishlist", label: "Favorit", icon: Heart },
];

function UserLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const { session, menu, contact } = Route.useLoaderData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [router.state.location.pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut();
      await navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  return (
    <UserSessionContext.Provider value={session}>
      <div className="min-h-screen bg-gradient-to-b from-paper to-paper-dim/30 flex flex-col">
        {/* Header */}
        {/*<header className="border-b border-line/60 bg-white/80 backdrop-blur-sm sticky top-0 z-40 mb-24">
          <Topbar
            me
            menuOpen={menuOpen}
            transparent={menuOpen}
            onMenuToggle={() => setMenuOpen((prev) => !prev)}
            onCartToggle={useCartStore((s) => s.toggleCart)}
          />
          <OverlayNav
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            menu={menu}
            contact={contact}
          />
        </header>*/}

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden border-b border-line/40 bg-white/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between sticky top-[57px] z-30">
          <button
            type="button"
            onClick={toggleMobileNav}
            className="flex items-center gap-2 text-[13px] font-semibold text-ink"
          >
            <UserIcon size={16} />
            Akun Saya
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${isMobileNavOpen ? "rotate-90" : ""}`}
            />
          </button>
          <span className="text-[12px] text-ash/60">
            {session.user.name || session.user.email}
          </span>
        </div>

        {/* Main Content - FIXED: Using items-start for alignment */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex-1 w-full flex flex-col md:flex-row gap-6 md:gap-10 py-6 md:py-12">
          {/* Sidebar Navigation - FIXED: Removed sticky from this level */}
          <aside className="md:w-64 md:shrink-0">
            {/* Desktop Nav */}
            <nav className="hidden md:block">
              <div className="bg-white rounded-xl border border-line/40 shadow-sm overflow-hidden sticky top-24">
                {/* User Info Card */}
                <div className="px-5 py-4 border-b border-line/40 bg-gradient-to-r from-blue-50/30 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-bright/10 flex items-center justify-center text-blue-bright font-head font-bold text-lg">
                      {session.user.name?.[0] ||
                        session.user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-head font-semibold text-sm text-ink truncate">
                        {session.user.name || "Pengguna"}
                      </p>
                      <p className="text-[11px] text-ash/70 truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nav Items */}
                <div className="p-2 space-y-0.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      activeOptions={{ exact: item.exact || false }}
                      activeProps={{
                        className: "bg-ink text-paper shadow-md",
                      }}
                      className="flex items-center my-2 gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium text-ink/80 hover:text-ink hover:bg-ink/5 transition-all group"
                    >
                      <item.icon
                        size={18}
                        className="group-hover:scale-105 transition-transform"
                      />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight
                        size={14}
                        className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-line/40 mx-4" />

                {/* Logout Button */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoggingOut ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <LogOut
                        size={18}
                        className="group-hover:scale-105 transition-transform"
                      />
                    )}
                    <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
                  </button>
                </div>
              </div>
            </nav>

            {/* Mobile Nav */}
            <nav
              className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileNavOpen
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-white rounded-xl border border-line/40 shadow-sm overflow-hidden mt-2">
                <div className="p-2 space-y-0.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      activeOptions={{ exact: item.exact || false }}
                      activeProps={{
                        className: "bg-ink text-paper",
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium text-ink/80 hover:bg-ink/5 transition-colors"
                      onClick={() => setIsMobileNavOpen(false)}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <LogOut size={18} />
                    )}
                    <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
                  </button>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content - FIXED: Added self-start for alignment */}
          <main className="flex-1 min-w-0 self-start">
            <div className="bg-white rounded-xl border border-line/40 shadow-sm p-6 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </UserSessionContext.Provider>
  );
}
