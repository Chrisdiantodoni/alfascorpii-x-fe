import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "#/stores/cart";
import { Image } from "./Image";
import { MaterialIcon } from "./MaterialIcon";

interface MiniProductCardProps {
	badge?: string;
	icon?: string;
	name: string;
	detail: string;
	price?: string;
	href: string;
	productId?: string | number;
	imageUrl?: string;
	onAddToCart?: () => void;
}

export function MiniProductCard({
	badge,
	icon,
	name,
	detail,
	price,
	href,
	productId,
	imageUrl,
	onAddToCart,
}: MiniProductCardProps) {
	const qty = useCartStore((state) => {
		if (!productId) return 0;
		const item = state.items.find((i) => String(i.id) === String(productId));
		return item?.qty ?? 0;
	});

	const [justAdded, setJustAdded] = useState(false);

	// Simpan timeout id supaya bisa dibersihkan kalau komponen unmount
	// sebelum 1 detik habis (mis. user pindah halaman cepat setelah klik).
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const handleCart = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!onAddToCart || justAdded) return;

		onAddToCart();
		setJustAdded(true);
		timeoutRef.current = setTimeout(() => setJustAdded(false), 1000);
	};

	return (
		<div className="group relative border border-line bg-paper hover:border-blue hover:shadow-xl hover:shadow-blue/10 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full overflow-hidden focus-within:ring-2 focus-within:ring-blue focus-within:ring-offset-1 rounded-sm">
			{/* Top accent line */}
			<div className="absolute top-0 left-0 right-0 h-[2px] bg-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out origin-left z-30 pointer-events-none" />

			{/* Link ditaruh sebagai overlay full-card (bukan pembungkus button),
          supaya HTML-nya valid: tidak ada elemen interaktif (button) di
          dalam elemen interaktif lain (a). Ini juga bikin urutan tab
          lebih jelas buat screen reader: [1] link ke detail produk,
          [2] tombol add-to-cart, alih-alih button "terkubur" di dalam link. */}
			<Link
				to={href}
				className="absolute inset-0 z-10 focus:outline-none"
				aria-label={`Lihat detail ${name}`}
			/>

			<div className="flex flex-col flex-grow pointer-events-none">
				{/* Container Gambar Produk */}
				<div className="aspect-[4/3] bg-gradient-to-b from-paper-dim/80 to-paper-dim/30 relative overflow-hidden flex items-center justify-center group-hover:from-paper-dim transition-colors duration-500">
					{badge && (
						<span className="absolute top-3 left-3 z-20 max-w-[70%] truncate text-[10px] font-bold tracking-widest px-2.5 py-1 bg-ink/80 text-paper rounded-[2px] uppercase backdrop-blur-md border border-white/10 shadow-sm select-none">
							{badge}
						</span>
					)}

					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={name}
							width={400}
							height={300}
							className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
						/>
					) : icon ? (
						<MaterialIcon
							name={icon}
							className="!text-[60px] text-blue/30 group-hover:text-blue/70 group-hover:scale-110 transition-all duration-500 select-none"
						/>
					) : null}

					{/* Tombol Add to Cart — pointer-events-auto & z-20 supaya tetap
              bisa diklik/di-tab meski wrapper di atasnya pointer-events-none
              dan Link overlay ada di bawahnya (z-10). */}
					{onAddToCart && (
						<button
							type="button"
							onClick={handleCart}
							disabled={justAdded}
							className={`absolute top-3 right-3 z-20 pointer-events-auto p-2.5 rounded-full transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-blue ${
								justAdded
									? "bg-blue text-white border-blue scale-110 shadow-md shadow-blue/30"
									: "bg-paper/90 backdrop-blur-md text-ash hover:text-blue border-line hover:border-blue shadow-sm hover:scale-110 active:scale-90"
							}`}
							aria-label={
								justAdded
									? `${name} berhasil ditambahkan ke keranjang`
									: `Tambah ${name} ke keranjang`
							}
						>
							{justAdded ? (
								<Check
									size={16}
									className="animate-in zoom-in-50 duration-200"
								/>
							) : (
								<div className="relative flex items-center justify-center">
									<ShoppingCart size={16} />
									{qty > 0 && (
										<span className="absolute -top-3 -right-3 min-w-[18px] h-[18px] rounded-full bg-blue text-white text-[9px] font-bold flex items-center justify-center leading-none px-1 border-2 border-paper shadow-xs">
											{qty > 99 ? "99+" : qty}
										</span>
									)}
								</div>
							)}
						</button>
					)}
				</div>

				{/* Detail Teks */}
				<div className="p-5 flex flex-col flex-grow justify-between gap-4 border-t border-line/50 bg-paper">
					<div className="space-y-1.5">
						<h3 className="font-head font-bold text-base leading-snug text-ink group-hover:text-blue transition-colors duration-300 line-clamp-1">
							{name}
						</h3>
						{/* whitespace-pre-line supaya \n dari detail (harga di baris baru) benar-benar tampil */}
						<p className="text-[13px] text-ash line-clamp-2 leading-relaxed font-normal whitespace-pre-line">
							{detail}
						</p>
						{price && (
							<p className="text-[17px] font-bold text-ink mt-1">{price}</p>
						)}
					</div>

					<div className="pt-2 flex items-center justify-between text-[11px] font-bold tracking-widest text-ink group-hover:text-blue transition-colors duration-300">
						<span className="inline-flex items-center gap-2">
							LIHAT DETAIL
							<ArrowRight
								size={13}
								className="transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out"
							/>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
