import { Link } from "@tanstack/react-router";
import type { ContactSettings } from "#/types";
import type { MenuData, MenuItemData } from "#/types/menu";

function footerRoute(item: MenuItemData): string | null {
	if (!item.reference?.slug) return null;
	if (item.type === "category") return "/category/$slug";
	if (item.type === "sub_category") return "/sub-category/$slug";
	if (item.type === "page") return "/$slug";
	return null;
}

function getLabel(item: MenuItemData): string {
	if (item.label) return item.label;
	if (item.type === "category" && item.reference) return item.reference.name;
	if (item.reference) return item.reference.title;
	return "";
}

export default function Footer({
	contact,
	menu,
}: {
	contact: ContactSettings;
	menu: MenuData[];
}) {
	const items = menu.find((m) => m.location === "footer")?.menuItems ?? [];
	const activeItems = items.filter((item) => item.isActive);

	return (
		<footer className="bg-[#0A0A0C] text-white pt-24 pb-10 px-6 md:px-16 mt-8">
			<div className="max-w-[1920px] mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-16 border-b border-white/10">
					<div className="md:col-span-1">
						<div className="font-head font-bold text-2xl mb-4">
							ALFA SCORPII X
						</div>
						<p className="text-[14px] text-white/50 max-w-xs">
							Main Dealer resmi Yamaha, melayani Sumatera bagian utara sejak
							1989.
						</p>
					</div>
					<div className="flex flex-col gap-4 text-[12px] tracking-widest">
						<h4 className="text-white/40 mb-1">Halaman</h4>
						<Link to="/" className="hover:text-blue-bright transition-colors">
							Beranda
						</Link>
						{activeItems.map((item) => {
							const to = footerRoute(item);
							const label = getLabel(item);
							if (!label) return null;

							if (to && item.reference?.slug) {
								return (
									<Link
										key={item.id}
										to={to}
										params={{ slug: item.reference.slug }}
										className="hover:text-blue-bright transition-colors"
									>
										{label}
									</Link>
								);
							}

							if (item.url) {
								return (
									<Link
										key={item.id}
										to={item.url}
										className="hover:text-blue-bright transition-colors"
									>
										{label}
									</Link>
								);
							}

							return null;
						})}
					</div>
					<div className="flex flex-col gap-4 text-[12px] tracking-widest">
						<h4 className="text-white/40 mb-1">Ikuti Kami</h4>
						{contact.social_media?.instagram && (
							<a
								href={contact.social_media.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-bright transition-colors"
							>
								Instagram
							</a>
						)}
						{contact.social_media?.tiktok && (
							<a
								href={contact.social_media.tiktok}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-bright transition-colors"
							>
								TikTok
							</a>
						)}
						{contact.social_media?.youtube && (
							<a
								href={contact.social_media.youtube}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-bright transition-colors"
							>
								YouTube
							</a>
						)}
					</div>
					<div className="flex flex-col gap-4 text-[12px] tracking-widest">
						<h4 className="text-white/40 mb-1">Kontak</h4>
						{contact.social_media?.whatsapp && (
							<a
								href={`https://wa.me/${contact.social_media.whatsapp}`}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-blue-bright transition-colors"
							>
								WhatsApp Admin
							</a>
						)}
						<a
							href={`mailto:${contact.email}`}
							className="hover:text-blue-bright transition-colors"
						>
							{contact.email}
						</a>
					</div>
				</div>
				<h3 className="font-head font-black text-[clamp(2.5rem,9vw,7rem)] leading-none py-14 tracking-tighter">
					Terus melaju, terus melayani.
				</h3>
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-8 border-t border-white/10 text-[12px] text-white/40 gap-4">
					<span>© 2026 Alfa Scorpii X. </span>
					{/*<div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>*/}
				</div>
			</div>
		</footer>
	);
}
