import { Link, useLocation } from "@tanstack/react-router";
import { SharedElement } from "../SharedElements";
import { Image } from "./Image";
import { MaterialIcon } from "./MaterialIcon";
import { WishlistButton } from "./WishlistButton";

interface MiniProductCardProps {
  badge?: string;
  icon?: string;
  name: string;
  detail: string;
  price?: string;
  href: string;
  slug: string;
  imageUrl?: string | null | undefined;
  disableLayoutId?: boolean;
  productId?: string;
}

export function MiniProductCard({
  badge,
  icon,
  name,
  detail,
  slug,
  price,
  href,
  imageUrl,
  disableLayoutId = false,
  productId,
}: MiniProductCardProps) {
  const location = useLocation();
  // 1. Cek apakah link tujuan card ini ke product
  const isTargetingProduct = href.startsWith("/product/");

  // 2. Tentukan apakah layoutId harus aktif:
  // - Aktif jika href menuju ke product DANKELUAR dari status disableLayoutId
  const shouldAnimate = isTargetingProduct && !disableLayoutId;
  return (
    <div className="group relative border border-line bg-paper hover:border-blue hover:shadow-md transition-all duration-300 ease-out flex flex-col h-full overflow-hidden focus-within:ring-2 focus-within:ring-blue focus-within:ring-offset-1 rounded-sm">
      {/* Full-card overlay link ke detail produk */}
      <Link
        resetScroll={false}
        to={href}
        state={(prev) => ({
          ...prev,
          from: location.pathname + location.searchStr,
        })}
        className="absolute inset-0 z-10 focus:outline-none"
        aria-label={`Lihat detail ${name}`}
      />

      <div className="flex flex-col flex-grow pointer-events-none">
        {/* Container Gambar Produk */}
        <div className="aspect-[4/3] bg-paper-dim/50 relative overflow-hidden flex items-center justify-center">
          {badge && (
            <span className="absolute top-3 left-3 z-20 max-w-[70%] truncate text-[10px] font-bold tracking-widest px-2.5 py-1 bg-ink/80 text-paper rounded-[2px] uppercase backdrop-blur-md border border-white/10 shadow-sm select-none">
              {badge}
            </span>
          )}
          {productId && (
            <div className="absolute top-3 right-3 z-20 pointer-events-auto">
              <WishlistButton productId={productId} className="!w-9 !h-9" />
            </div>
          )}
          <SharedElement
            layoutId={shouldAnimate ? `product-card-${slug}` : undefined}
          >
            <div className="aspect-square bg-paper-dim overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain"
                />
              ) : icon ? (
                <MaterialIcon
                  name={icon}
                  className="!text-[60px] text-blue/30 select-none"
                />
              ) : null}
            </div>
          </SharedElement>
        </div>

        {/* Detail Teks */}
        <div className="p-4 flex flex-col flex-grow justify-between gap-3 bg-paper">
          <div className="space-y-1.5">
            <h3 className="font-head font-bold text-base leading-snug text-ink line-clamp-1">
              {name}
            </h3>
            {/* whitespace-pre-line supaya \n dari detail (harga di baris baru) benar-benar tampil */}
            <p className="text-[13px] text-ash line-clamp-2 leading-relaxed font-normal whitespace-pre-line">
              {detail}
            </p>
            {price && (
              <p className="text-[15px] font-semibold text-ink mt-1">{price}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
