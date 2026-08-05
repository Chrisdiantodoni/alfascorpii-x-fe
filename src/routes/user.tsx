// owned by: italfa:staff
import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useNavigate,
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
} from "lucide-react";
import { createContext, useContext } from "react";
import { signOut } from "#/lib/auth-client";
import { getSession } from "#/server/session";

export const Route = createFileRoute("/user")({
	loader: async () => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect({ to: "/login" });
		}
		return { session };
	},
	component: UserLayout,
});

const UserSessionContext = createContext<Session | null>(null);

export function useUserSession() {
	return useContext(UserSessionContext);
}

const navItems = [
	{ to: "/user", label: "Ringkasan", icon: Home },
	{ to: "/user/profile", label: "Profil", icon: UserIcon },
	{ to: "/user/security", label: "Keamanan", icon: Shield },
	{ to: "/user/wishlist", label: "Favorit", icon: Heart },
];

function UserLayout() {
	const navigate = useNavigate();
	const { session } = Route.useLoaderData();

	const handleLogout = async () => {
		await signOut();
		await navigate({ to: "/" });
	};

	return (
		<UserSessionContext.Provider value={session}>
			<div className="min-h-screen bg-paper flex flex-col">
				<header className="border-b border-line bg-paper">
					<div className="max-w-[1280px] mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
						<Link
							to="/"
							className="font-head font-extrabold text-lg tracking-tight text-ink hover:text-blue transition-colors"
						>
							ALFA SCORPII X
						</Link>
						<Link
							to="/store"
							className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-ink hover:text-blue transition-colors"
						>
							<Store size={16} />
							<span className="hidden sm:inline">KEMBALI KE TOKO</span>
							<ArrowLeft size={16} className="sm:hidden" />
						</Link>
					</div>
				</header>

				<div className="max-w-[1280px] mx-auto px-6 md:px-8 flex-1 w-full flex flex-col md:flex-row gap-8 py-8 md:py-12">
					<aside className="md:w-56 md:shrink-0">
						<div className="border border-line bg-paper-dim p-2 flex md:flex-col gap-1 md:sticky md:top-8 overflow-x-auto">
							{navItems.map((item) => (
								<Link
									key={item.to}
									to={item.to}
									activeOptions={{ exact: item.to === "/user" }}
									activeProps={{
										className: "bg-ink text-paper",
									}}
									className="flex items-center gap-3 px-4 py-3 text-[12px] font-semibold tracking-widest text-ink hover:bg-ink/10 transition-colors whitespace-nowrap shrink-0"
								>
									<item.icon size={16} />
									{item.label}
								</Link>
							))}
							<button
								type="button"
								onClick={handleLogout}
								className="flex items-center gap-3 px-4 py-3 text-[12px] font-semibold tracking-widest text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap shrink-0"
							>
								<LogOut size={16} />
								KELUAR
							</button>
						</div>
					</aside>

					<main className="flex-1 min-w-0">
						<Outlet />
					</main>
				</div>
			</div>
		</UserSessionContext.Provider>
	);
}
