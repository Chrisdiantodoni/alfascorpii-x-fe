// owned by: italfa:staff
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";
import { useState } from "react";
import { Image } from "#/components/ui/Image";
import { getWishlist } from "#/server/wishlist";
import { useWishlistStore } from "#/stores/wishlist";

export const Route = createFileRoute("/user/wishlist")({
	loader: async () => {
		const items = await getWishlist();
		return { items };
	},
	component: UserWishlist,
});

function UserWishlist() {
	const { items: initialItems } = Route.useLoaderData();
	const [items, setItems] = useState(initialItems);
	const toggle = useWishlistStore((s) => s.toggle);

	const handleRemove = async (productId: string) => {
		setItems((prev) => prev.filter((item) => item.productId !== productId));
		await toggle(productId);
	};

	return (
		<div className="space-y-8">
			<div>
				<span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-2 block">
					AKUN SAYA
				</span>
				<h1 className="font-head font-black text-3xl md:text-4xl tracking-tight text-ink">
					Produk Favorit
				</h1>
			</div>

			{items.length === 0 ? (
				<div className="border border-line bg-paper-dim p-10 text-center">
					<Heart size={32} className="text-ash/50 mx-auto mb-4" />
					<p className="font-head font-bold text-lg text-ink mb-2">
						Belum ada favorit
					</p>
					<p className="text-[13px] text-ash mb-6">
						Ketuk ikon hati pada produk untuk menyimpannya di sini.
					</p>
					<Link
						to="/store"
						className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-[12px] font-semibold tracking-widest text-ink hover:bg-ink hover:text-white transition-colors"
					>
						LIHAT TOKO
						<ArrowRight size={14} />
					</Link>
				</div>
			) : (
				<div className="border border-line divide-y divide-line bg-paper-dim">
					{items.map((item) => {
						const image = item.product.files[0];
						return (
							<div
								key={item.id}
								className="p-4 md:p-5 flex items-center gap-4 md:gap-6"
							>
								<Link
									to={`/product/${item.product.slug}`}
									className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-paper overflow-hidden border border-line/60"
								>
									{image?.url ? (
										<Image
											src={image.url}
											alt={item.product.name}
											width={160}
											height={160}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-ash/40 text-[10px] uppercase tracking-widest">
											No image
										</div>
									)}
								</Link>

								<div className="flex-1 min-w-0">
									<Link
										to={`/product/${item.product.slug}`}
										className="font-head font-bold text-[15px] text-ink hover:text-blue transition-colors line-clamp-1"
									>
										{item.product.name}
									</Link>
									{item.product.code && (
										<p className="text-[12px] text-ash mt-0.5">
											{item.product.code}
										</p>
									)}
									{item.product.price && (
										<p className="text-[15px] font-bold text-ink mt-1">
											Rp {Number(item.product.price).toLocaleString("id-ID")}
										</p>
									)}
								</div>

								<button
									type="button"
									aria-label={`Hapus ${item.product.name} dari favorit`}
									onClick={() => handleRemove(item.productId)}
									className="shrink-0 inline-flex items-center justify-center w-9 h-9 border border-line text-ink hover:text-red-600 hover:border-red-300 transition-colors"
								>
									<Heart size={16} className="fill-current" />
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
