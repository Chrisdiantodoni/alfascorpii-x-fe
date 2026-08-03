import { Check, MessageCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { cms } from "#/data/cms";
import { useCartStore } from "#/stores/cart";
import { Image } from "./Image";
import { MaterialIcon } from "./MaterialIcon";

type Product = (typeof cms.featuredProducts)[number] & {
	imageUrl?: string;
};

function getProductType(
	product: Product,
	categories: typeof cms.featuredCategories,
) {
	const sub = categories
		.flatMap((c) => c.subCategories)
		.find((s) => s.id === product.subCategoryId);
	if (!sub) return "genuine";
	const parentCat = categories.find((c) =>
		c.subCategories.some((s) => s.id === sub.id),
	);
	if (parentCat && parentCat.slug === "sepeda-motor") return "motor" as const;
	return sub.slug === "sparepart-klasik"
		? ("legacy" as const)
		: ("genuine" as const);
}

const zoneIcon: Record<string, string> = {
	"sub-premium": "two_wheeler",
	"sub-fashionable": "moped",
	"sub-exciting": "sports_motorsports",
	"sub-active": "electric_moped",
};

function rupiah(n: number | null) {
	if (n == null) return null;
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(n);
}

interface ProductCardProps {
	product: Product;
	categories: typeof cms.featuredCategories;
	large?: boolean;
}

export function ProductCard({ product, categories, large }: ProductCardProps) {
	const type = getProductType(product, categories);
	const sub = categories
		.flatMap((c) => c.subCategories)
		.find((s) => s.id === product.subCategoryId);
	const addItem = useCartStore((s) => s.addItem);
	const qty = useCartStore(
		(s) => s.items.find((i) => i.id === product.id)?.qty ?? 0,
	);
	const [justAdded, setJustAdded] = useState(false);

	const icon =
		type === "motor"
			? zoneIcon[product.subCategoryId] || "two_wheeler"
			: type === "legacy"
				? "history"
				: "settings";

	const codeLabel =
		type === "motor"
			? sub?.name.toUpperCase() || "MOTOR"
			: product.code || "ARSIP";

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const item = useCartStore((s) =>
			s.items.some((i) => String(i.id) === String(product.id)),
		);
		window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
	};
}

const badgeColor =
	type === "motor"
		? "bg-blue/10 text-blue"
		: type === "legacy"
			? "bg-amber-500/10 text-amber-600"
			: "bg-paper-dim text-ash";

if (large) {
	return (
      <div className="store-item md:col-span-2 md:row-span-2 bg-paper border border-line p-8 flex flex-col justify-between group hover:border-blue transition-all duration-300 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        {/* Top Header Section */}
        <div className="flex justify-between items-start gap-4 z-10">
          <div>
            <span
              className={`inline-block text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-sm mb-3 uppercase ${badgeColor}`}
            >
              {codeLabel}
            </span>
            <h3 className="font-head font-extrabold text-2xl text-ink group-hover:text-blue transition-colors">
              {product.name}
            </h3>
            <p className="text-[14px] text-ash mt-1 max-w-sm line-clamp-2 leading-relaxed">
              {product.description || "Unit resmi garansi pabrikan Yamaha."}
            </p>
          </div>
          {product.price != null ? (
            <div className="text-right">
              <span className="text-[11px] text-ash block uppercase tracking-wider">
                Harga OTR
              </span>
              <span className="text-lg font-bold text-ink">
                {rupiah(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-[12px] font-semibold text-blue bg-blue/5 px-3 py-1.5 rounded-sm border border-blue/20">
              {type === "motor" ? "Tanya Promo" : "Cek Stok"}
            </span>
          )}
        </div>

        {/* Media / Image Display Container */}
        <div className="my-8 w-full h-52 bg-paper-dim/60 rounded-sm flex items-center justify-center overflow-hidden relative group-hover:bg-paper-dim transition-colors">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <MaterialIcon
              name={icon}
              className="text-blue/30 !text-[96px] group-hover:scale-110 group-hover:text-blue/50 transition-all duration-500"
            />
          )}
        </div>

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-line z-10">
          <span className="text-[12px] text-ash font-medium">
            Garansi Resmi Alfa Scorpii
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={justAdded && type === "genuine"}
            className={`inline-flex items-center gap-2 text-[12px] font-bold tracking-widest px-5 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95 ${
              justAdded && type === "genuine"
                ? "bg-blue text-white animate-pop"
                : "bg-ink text-white group-hover:bg-blue"
            }`}
          >
            {type === "genuine" ? (
              justAdded ? (
                <>
                  <Check size={14} /> DITAMBAHKAN
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />{" "}
                  {qty > 0 ? `TAMBAH LAGI (×${qty})` : "TAMBAH KERANJANG"}
                </>
              )
            ) : (
              <>
                <MessageCircle size={14} /> HUBUNGI ADMIN
              </>
            )}
          </button>
        </div>
      </div>
    );
}

// Standard Compact Card
const borderCls = type === "legacy" ? "border-dashed" : "border-solid";

return (
    <div
      className={`store-item bg-paper border ${borderCls} border-line p-5 flex flex-col justify-between group hover:border-blue transition-all duration-300 relative`}
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-semibold tracking-wider text-ash uppercase">
            {codeLabel}
          </span>
          {type === "legacy" && (
            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 font-bold rounded-sm">
              KLASIK
            </span>
          )}
        </div>
        <h3 className="font-head font-bold text-base text-ink group-hover:text-blue transition-colors line-clamp-1">
          {product.name}
        </h3>
      </div>

      {/* Image / Icon Box */}
      <div className="my-5 h-32 bg-paper-dim/50 rounded-sm flex items-center justify-center overflow-hidden relative group-hover:bg-paper-dim transition-colors">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <MaterialIcon
            name={icon}
            className="!text-[48px] text-blue/30 group-hover:text-blue/60 group-hover:scale-110 transition-all duration-300"
          />
        )}
      </div>

      {/* Footer Info & Quick Action */}
      <div className="flex justify-between items-end pt-3 border-t border-line">
        <div>
          <span className="text-[10px] text-ash block uppercase font-medium">
            Harga
          </span>
          {product.price != null ? (
            <span className="text-[14px] font-bold text-ink">
              {rupiah(product.price)}
            </span>
          ) : (
            <span className="text-[12px] font-semibold text-blue">
              {type === "motor" ? "Hubungi admin" : "Cek stok"}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={justAdded && type === "genuine"}
          className={`p-2 rounded-full transition-all duration-300 border hover:scale-110 active:scale-90 relative ${
            justAdded && type === "genuine"
              ? "bg-blue text-white border-blue animate-pop"
              : "text-ink hover:bg-blue hover:text-white border-line hover:border-blue"
          }`}
          aria-label={
            justAdded && type === "genuine"
              ? "Berhasil ditambahkan"
              : type === "genuine"
                ? "Tambah ke keranjang"
                : "Tanya admin"
          }
        >
          {type === "genuine" ? (
            justAdded ? (
              <Check size={16} />
            ) : (
              <>
                <ShoppingCart size={16} />
                {qty > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-blue text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {qty}
                  </span>
                )}
              </>
            )
          ) : (
            <MessageCircle size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
