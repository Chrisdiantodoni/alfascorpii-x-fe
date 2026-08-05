import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/Button";
import { Image } from "#/components/ui/Image";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { cms } from "#/data/cms";
import { useCartStore } from "#/stores/cart";

function rupiah(n: number | null) {
  if (n == null) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function itemIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("yamalube") || n.includes("oli")) return "water_drop";
  if (n.includes("klasik") || n.includes("legacy") || n.includes("arsip"))
    return "history";
  if (
    n.includes("nmax") ||
    n.includes("aerox") ||
    n.includes("filano") ||
    n.includes("r15") ||
    n.includes("gear") ||
    n.includes("motor")
  )
    return "two_wheeler";
  return "settings";
}

interface ProductThumbProps {
  item: {
    name: string;
    thumbnailUrl?: string | null;
    image?: string | null;
    thumbnail_url?: string | null;
  };
  className?: string;
}

function ProductThumb({ item, className = "" }: ProductThumbProps) {
  const src = item.thumbnailUrl ?? item.image ?? item.thumbnail_url ?? null;
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={item.name}
        width={96}
        height={96}
        className={`object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`bg-paper-dim flex items-center justify-center ${className}`}
    >
      <MaterialIcon
        name={itemIcon(item.name)}
        className="text-blue !text-[26px]"
      />
    </div>
  );
}

export default function CartDrawer() {
  const open = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const subtotal = useCartStore((s) => s.subtotal());
  const lastAddedId = useCartStore((s) => s.lastAddedId);
  const clearLastAdded = useCartStore((s) => s.clearLastAdded);

  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (!lastAddedId) return;
    setHighlightId(lastAddedId);
    const t = setTimeout(() => {
      setHighlightId(null);
      clearLastAdded();
    }, 2000);
    return () => clearTimeout(t);
  }, [lastAddedId, clearLastAdded]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, closeCart]);

  const waNumber = (
    cms.contact.socialMedia.whatsapp ||
    cms.contact.telNumber ||
    ""
  ).replace(/\D/g, "");

  const checkoutText = encodeURIComponent(
    `Halo Alfa Scorpii, saya mau pesan:\n${items
      .map(
        (c) =>
          `- ${c.name} x${c.qty}${c.price != null ? ` (${rupiah(c.price)})` : ""}`,
      )
      .join("\n")}\n\nTotal: ${rupiah(subtotal)}`,
  );

  const checkoutUrl = `https://wa.me/${waNumber}?text=${checkoutText}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="cart-overlay"
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.aside
            key="cart-panel"
            className="fixed top-0 right-0 bottom-0 z-[51] w-full max-w-[380px] bg-paper flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 280,
            }}
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-line">
              <div className="flex items-center gap-2">
                <h3 className="font-head font-bold text-lg text-ink">
                  Keranjang
                </h3>
                {items.length > 0 && (
                  <span className="text-[11px] font-semibold bg-blue/10 text-blue px-2 py-0.5 rounded-full">
                    {items.reduce((acc, curr) => acc + curr.qty, 0)} items
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Tutup keranjang"
                className="text-ash hover:text-ink transition-colors p-1"
              >
                <MaterialIcon name="close" className="!text-[22px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <motion.div
                  className="text-center py-16 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    viewBox="0 0 200 100"
                    width="100%"
                    height="100"
                    className="max-w-[180px] mx-auto opacity-80"
                  >
                    <circle
                      cx="100"
                      cy="50"
                      r="42"
                      fill="rgba(11,61,145,.06)"
                    />
                    <g stroke="#9CA3AF" strokeWidth="2" fill="none">
                      <path d="M60 40 H140 L132 78 H68 Z" />
                      <path d="M78 40 V30 a22 22 0 0 1 44 0 V40" />
                      <path d="M60 40 L52 40" strokeLinecap="round" />
                      <path d="M140 40 L148 40" strokeLinecap="round" />
                    </g>
                  </svg>
                  <p className="text-[13px] text-ash mt-4 leading-relaxed">
                    Keranjang masih kosong.
                    <br />
                    Tambahkan sparepart atau aksesoris dari toko.
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: -40,
                          height: 0,
                          marginBottom: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                        transition={{
                          opacity: { duration: 0.2 },
                          layout: {
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                          },
                        }}
                        className={`group flex gap-4 -mx-3 px-3 py-3 rounded-lg transition-colors duration-500 ${
                          highlightId === item.id ? "bg-blue/10" : ""
                        }`}
                      >
                        <ProductThumb
                          item={item}
                          className="w-24 h-24 rounded-md flex-none"
                        />

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-ink truncate">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-ash mt-0.5">
                                {item.price != null
                                  ? `${rupiah(item.price)} / item`
                                  : "Hubungi admin"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -item.qty)}
                              aria-label={`Hapus ${item.name}`}
                              className="flex-none text-ash hover:text-blue transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <MaterialIcon
                                name="close"
                                className="!text-[16px]"
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-line rounded-full overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, -1)}
                                disabled={item.qty <= 1}
                                aria-label="Kurangi jumlah"
                                className="w-7 h-7 text-[14px] font-medium text-ink hover:bg-paper-dim disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center transition-colors"
                              >
                                −
                              </button>
                              <span className="w-7 text-center text-[12px] font-semibold text-ink tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, 1)}
                                aria-label="Tambah jumlah"
                                className="w-7 h-7 text-[14px] font-medium text-ink hover:bg-paper-dim flex items-center justify-center transition-colors"
                              >
                                +
                              </button>
                            </div>
                            {item.price != null && (
                              <span className="text-[12px] font-semibold text-ink tabular-nums">
                                {rupiah(item.price * item.qty)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="border-t border-line px-6 py-6 bg-paper">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[13px] text-ash">Subtotal</span>
                <span className="font-head font-bold text-lg text-ink">
                  {rupiah(subtotal)}
                </span>
              </div>

              {items.length > 0 ? (
                <Button
                  href={checkoutUrl}
                  external
                  className="w-full text-center justify-center"
                >
                  CHECKOUT VIA WHATSAPP
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full text-center justify-center opacity-50 cursor-not-allowed"
                >
                  KERANJANG KOSONG
                </Button>
              )}

              <p className="text-[11px] text-ash mt-3 text-center leading-relaxed">
                Pemesanan diteruskan langsung ke admin resmi Alfa Scorpii via
                WhatsApp.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
