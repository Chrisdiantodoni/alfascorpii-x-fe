import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageBanner } from "#/components/PageBanner";
import { SharedElement } from "#/components/SharedElements";
import { ProductDetailSkeleton } from "#/components/skeleton/ProductDetailSkeleton";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import { Button } from "#/components/ui/Button";
import { MaterialIcon } from "#/components/ui/MaterialIcon";
import { ProductGallery } from "#/components/ui/ProductGallery";
import { ShareButton } from "#/components/ui/ShareButton";
import { WishlistButton } from "#/components/ui/WishlistButton";
import { getBanners } from "#/server/cms";
import { getProductDetail } from "#/server/master";
import { type CartColor, lineId, useCartStore } from "#/stores/cart";
import { formatRupiah } from "#/utils/fn";
import type { BannerProps } from "#/types";
import type { Banner } from "#/components/ui/BannerSlide";

export const Route = createFileRoute("/_public/product/$slug/")({
  component: ProductDetail,
  pendingMs: 0,
  pendingComponent: ProductDetailSkeleton,
  loader: async ({ params }) => {
    const [data, banners] = await Promise.all([
      getProductDetail({
        data: { slug: params.slug },
      }),
    ]);
    return { data };
  },
});

function ProductDetail() {
  const { data } = Route.useLoaderData();
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const location = useLocation();

  const colors = ("id" in data ? (data.productColors ?? []) : []) as Array<{
    id: string;
    hex: string;
    name: string;
  }>;

  const firstColor = colors[0] ?? null;
  const [selectedColor, setSelectedColor] = useState<CartColor | null>(
    firstColor,
  );

  useEffect(() => {
    setSelectedColor(firstColor);
  }, [firstColor]);

  const productId = "id" in data ? String(data.id) : null;
  const qty =
    productId && selectedColor
      ? (items.find((i) => i.id === lineId(productId, selectedColor))?.qty ?? 0)
      : productId
        ? (items.find((i) => i.id === lineId(productId, null))?.qty ?? 0)
        : 0;

  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  interface SpecRow {
    key: string;
    label?: string;
    value: string | number;
    group?: string;
  }

  const specRows = Array.isArray(data.specValues)
    ? (data.specValues as SpecRow[])
    : null;

  const specGroups = useMemo(() => {
    if (!specRows || specRows.length === 0) return null;
    const map = new Map<string, SpecRow[]>();
    for (const spec of specRows) {
      const group = spec.group || "Lainnya";
      const list = map.get(group) ?? [];
      list.push(spec);
      map.set(group, list);
    }
    return [...map.entries()];
  }, [specRows]);

  const handleAddToCart = () => {
    if (justAdded || !("id" in data)) return;
    addItem({
      productId: String(data.id),
      name: data.name,
      price: data.price != null ? Number(data.price) : null,
      code: data.code,
      color: selectedColor,
    });
    setJustAdded(true);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1200);
  };

  if (!("id" in data)) {
    return (
      <div className="pt-32 text-center">
        <p className="text-ash">Produk tidak ditemukan.</p>
        <Link
          resetScroll={false}
          to="/store"
          className="text-blue hover:underline mt-4 inline-block"
        >
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  const sub = data.subCategory;
  const files = (data.files ?? []) as Array<{
    url: string | null;
    role: string;
  }>;
  const price =
    data.price != null ? formatRupiah(Number(data.price)) : "Hubungi admin";

  const backTo = (location.state as { from?: string })?.from || "/store";

  const mapToBanners = (
    items: Array<{ url: string | null; role: string }>,
    targetRole: string,
  ): Banner[] => {
    return items
      .filter(
        (f): f is { url: string; role: string } =>
          f.role === targetRole && Boolean(f.url),
      )
      .map((f, index) => ({
        id: `${targetRole}-${index}`,
        title: null,
        subtitle: null,
        imageUrl: f.url,
        clickUrl: null,
        ctaText: null,
        textColor: "light",
        overlay: false,
        placement: targetRole,
        orderPosition: index,
        isActive: true,
        startDate: null,
        endDate: null,
        fieldSettings: null,
      }));
  };

  // 2. Gunakan di dalam komponen ProductDetail
  const banners = {
    hero: mapToBanners(files, "top_banners"),
    top: [] as Banner[],
    middle: mapToBanners(files, "middle_banners"), // Typo 'middle_baners' diperbaiki
    bottom: mapToBanners(files, "bottom_banners"),
  };

  return (
    <div className={banners.hero ? "pt-[6.75rem]" : ""}>
      <PageBanner hero={banners.hero} top={banners.top} />

      <section className={banners.hero ? "pt-8 pb-8" : "pt-32 pb-8"}>
        <Link
          resetScroll={false}
          to={backTo}
          className="inline-flex items-center gap-2 text-[11px] tracking-widest text-ash hover:text-blue transition-colors"
        >
          <MaterialIcon name="arrow_back" className="!text-[16px]" />
          KEMBALI
        </Link>
      </section>
      <BannerCarousel banners={banners.middle} className="-mx-6 md:-mx-16" />

      <section className="pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <SharedElement
          layoutId={`product-card-${data.slug}`}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="p-2">
            <ProductGallery files={files} productName={data.name} />
          </div>
        </SharedElement>
        <div>
          {sub && (
            <span className="text-[12px] tracking-widest text-blue-bright font-semibold">
              {sub.name.toUpperCase()}
            </span>
          )}
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-head font-black text-3xl md:text-4xl tracking-tight mt-3 mb-2">
              {data.name}
            </h1>
            <div className="flex gap-2 shrink-0 mt-3">
              <WishlistButton productId={String(data.id)} />
              <ShareButton title={data.name} text={data.name} />
            </div>
          </div>
          {data.code && (
            <p className="text-[12px] text-ash mb-6">{data.code}</p>
          )}
          <p className="font-head font-bold text-2xl mb-6">{price}</p>
          <p className="text-ash leading-relaxed mb-8 max-w-lg">
            {data.description}
          </p>

          {colors.length > 0 && (
            <div className="mb-8">
              <span className="block text-[11px] tracking-widest text-ash mb-3">
                PILIHAN WARNA
              </span>
              <div className="flex gap-3">
                {colors.map((c) => {
                  const active = selectedColor?.id === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() =>
                        setSelectedColor({
                          id: c.id,
                          name: c.name,
                          hex: c.hex,
                        })
                      }
                      aria-label={`Pilih warna ${c.name}`}
                      aria-pressed={active}
                      className={`relative w-8 h-8 rounded-full border transition-all ${
                        active
                          ? "border-blue ring-2 ring-blue/40 scale-110"
                          : "border-line hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {active && (
                        <Check
                          size={14}
                          className="absolute inset-0 m-auto text-white drop-shadow"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedColor && (
                <p className="text-[12px] text-ash mt-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  {selectedColor.name}
                </p>
              )}
            </div>
          )}

          <p className="text-[13px] mb-8">
            {data.stock > 0
              ? `${data.stock} unit tersedia`
              : "Cek ketersediaan"}
          </p>

          {data.price != null ? (
            <motion.div
              transition={{ duration: 0.15 }}
              className="w-full sm:w-auto"
            >
              <Button
                className="w-full sm:w-auto min-w-[200px] relative overflow-hidden"
                onClick={handleAddToCart}
                disabled={justAdded}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Check size={15} />
                      DITAMBAHKAN
                    </motion.span>
                  ) : qty > 0 ? (
                    <motion.span
                      key={`in-cart-${qty}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      DI KERANJANG ({qty})
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      TAMBAH KE KERANJANG
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          ) : (
            <Button className="w-full sm:w-auto" disabled>
              HUBUNGI ADMIN
            </Button>
          )}
          {data.specValues &&
            ((specGroups && specGroups.length > 0) ||
              (typeof data.specValues === "object" &&
                !Array.isArray(data.specValues) &&
                Object.keys(data.specValues).length > 0)) && (
              <div className="mt-12">
                <span className="block text-[11px] tracking-widest text-ash mb-3">
                  SPESIFIKASI
                </span>
                <div className="space-y-6">
                  {specGroups
                    ? specGroups.map(([group, items]) => (
                        <SpecGroup key={group} title={group}>
                          {items.map((spec) => (
                            <div
                              key={spec.key}
                              className="flex justify-between py-2 border-b border-line text-sm"
                            >
                              <span className="text-ash">
                                {spec.label || spec.key}
                              </span>
                              <span className="font-semibold">
                                {String(spec.value)}
                              </span>
                            </div>
                          ))}
                        </SpecGroup>
                      ))
                    : Object.entries(
                        data.specValues as Record<string, unknown>,
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-line text-sm"
                        >
                          <span className="text-ash">{key}</span>
                          <span className="font-semibold">{String(value)}</span>
                        </div>
                      ))}
                </div>
              </div>
            )}
        </div>
      </section>
      <BannerCarousel banners={banners.bottom} className="-mx-6 md:-mx-16" />
    </div>
  );
}

interface SpecGroupProps {
  title: string;
  children: ReactNode;
}

function SpecGroup({ title, children }: SpecGroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mb-2 flex w-full items-center justify-between md:pointer-events-none md:cursor-default"
      >
        <span className="block font-bold uppercase tracking-wider text-[11px] text-ink">
          {title}
        </span>
        <MaterialIcon
          name={open ? "expand_less" : "expand_more"}
          className="!text-[16px] text-ash md:hidden"
        />
      </button>
      <div className={open ? "block" : "hidden md:block"}>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}
