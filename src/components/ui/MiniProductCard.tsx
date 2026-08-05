import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
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
    <div className="group relative border border-line bg-paper hover:border-blue hover:shadow-xl hover:shadow-blue/10 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full overflow-hidden focus-within:ring-2 focus-within:ring-blue focus-within:ring-offset-1 rounded-sm">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out origin-left z-30 pointer-events-none" />

      {/* Full-card overlay link ke detail produk */}
      <Link
        to={href}
        state={(prev) => ({
          ...prev,
          from: window.location.pathname + window.location.search,
        })}
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
          {productId && (
            <div className="absolute top-3 right-3 z-20 pointer-events-auto">
              <WishlistButton productId={productId} className="!w-9 !h-9" />
            </div>
          )}
          <motion.div
            layoutId={shouldAnimate ? `product-card-${slug}` : undefined}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="aspect-square bg-paper-dim overflow-hidden mb-5"
          >
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
          </motion.div>
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
