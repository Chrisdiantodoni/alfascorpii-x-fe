// owned by: italfa:staff
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Shield, User as UserIcon } from "lucide-react";
import { getWishlist } from "#/server/wishlist";
import { useUserSession } from "./user";

export const Route = createFileRoute("/user/")({
	loader: async () => {
		const wishlist = await getWishlist();
		return { wishlistCount: wishlist.length };
	},
	component: UserOverview,
});

function UserOverview() {
	const session = useUserSession();
	const { wishlistCount } = Route.useLoaderData();

	if (!session) return null;

	const user = session.user;
	const initials =
		user.name
			.split(" ")
			.map((part) => part[0])
			.filter(Boolean)
			.slice(0, 2)
			.join("")
			.toUpperCase() || "U";

	const joinedAt = user.createdAt
		? new Date(user.createdAt).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: "-";

	return (
		<div className="space-y-8">
			<div>
				<span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-2 block">
					RINGKASAN
				</span>
				<h1 className="font-head font-black text-3xl md:text-4xl tracking-tight text-ink">
					Halo, {user.name.split(" ")[0]}
				</h1>
			</div>

			<div className="border border-line bg-paper-dim p-6 flex items-center gap-5">
				<div className="w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center font-head font-bold text-lg shrink-0">
					{initials}
				</div>
				<div className="min-w-0">
					<p className="font-head font-bold text-lg text-ink truncate">
						{user.name}
					</p>
					<p className="text-[13px] text-ash truncate">{user.email}</p>
					{user.whatsapp && (
						<p className="text-[13px] text-ash truncate">
							WhatsApp: {user.whatsapp}
						</p>
					)}
				</div>
			</div>

			<div className="border border-line p-6">
				<p className="text-[11px] tracking-widest text-ash mb-4">AKUN ANDA</p>
				<dl className="space-y-3 text-[14px]">
					<div className="flex justify-between gap-4">
						<dt className="text-ash">Member sejak</dt>
						<dd className="text-ink font-medium">{joinedAt}</dd>
					</div>
					<div className="flex justify-between gap-4">
						<dt className="text-ash">Produk favorit</dt>
						<dd className="text-ink font-medium">{wishlistCount}</dd>
					</div>
				</dl>
			</div>

			<div className="grid sm:grid-cols-3 gap-4">
				<Link
					to="/user/profile"
					className="border border-line hover:border-blue transition-colors p-5 flex flex-col gap-3"
				>
					<UserIcon size={20} className="text-blue-bright" />
					<span className="text-[12px] font-semibold tracking-widest text-ink">
						PROFIL
					</span>
					<span className="text-[12px] text-ash leading-relaxed">
						Kelola nama, email, dan nomor WhatsApp
					</span>
				</Link>
				<Link
					to="/user/security"
					className="border border-line hover:border-blue transition-colors p-5 flex flex-col gap-3"
				>
					<Shield size={20} className="text-blue-bright" />
					<span className="text-[12px] font-semibold tracking-widest text-ink">
						KEAMANAN
					</span>
					<span className="text-[12px] text-ash leading-relaxed">
						Ganti kata sandi dan kelola sesi
					</span>
				</Link>
				<Link
					to="/user/wishlist"
					className="border border-line hover:border-blue transition-colors p-5 flex flex-col gap-3"
				>
					<Heart size={20} className="text-blue-bright" />
					<span className="text-[12px] font-semibold tracking-widest text-ink">
						FAVORIT
					</span>
					<span className="text-[12px] text-ash leading-relaxed">
						Lihat produk yang kamu simpan
					</span>
				</Link>
			</div>
		</div>
	);
}
