// owned by: italfa:staff
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Image } from "#/components/ui/Image";
import { getWishlist } from "#/server/wishlist";
import { useWishlistStore } from "#/stores/wishlist";
import { EmptyStateDashboard } from "#/components/ui/Dashboard/EmptyStateDashboard";
import { PageHeader } from "#/components/ui/Dashboard/PageHeader";

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
  const [removingId, setRemovingId] = useState<string | null>(null);
  const toggle = useWishlistStore((s) => s.toggle);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    await toggle(productId);
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    setRemovingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <PageHeader
        label="Wishlist"
        title="Produk Favorit"
        subtitle={
          items.length > 0 ? `${items.length} produk tersimpan` : undefined
        }
      />

      {items.length === 0 ? (
        // Empty State - Enhanced
        <EmptyStateDashboard
          icon={Heart}
          title="Belum ada favorit"
          description={
            <>
              Ketuk ikon{" "}
              <Heart size={12} className="inline text-pink-400 fill-current" />{" "}
              pada produk untuk menyimpannya di sini.
            </>
          }
          ctaText="Jelajahi Toko"
          ctaTo="/store"
          ctaIcon={ShoppingBag}
          ctaVariant="primary"
        />
      ) : (
        // Product List - Enhanced
        <div className="bg-white rounded-xl border border-line/50 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-line/40">
            {items.map((item) => {
              const image = item.product.files[0];
              const isRemoving = removingId === item.productId;

              return (
                <div
                  key={item.id}
                  className={`group p-4 md:p-5 flex items-center gap-4 md:gap-6 transition-all hover:bg-paper-dim/30 ${
                    isRemoving ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-paper overflow-hidden rounded-lg border border-line/40 shadow-sm group-hover:shadow-md transition-shadow"
                  >
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={item.product.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ash/30 text-[10px] uppercase tracking-widest bg-paper-dim">
                        No image
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-head font-bold text-[15px] text-ink hover:text-blue-bright transition-colors line-clamp-1 group-hover:underline underline-offset-2"
                    >
                      {item.product.name}
                    </Link>
                    {item.product.code && (
                      <p className="text-[11px] text-ash/70 tracking-wider uppercase">
                        {item.product.code}
                      </p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap mt-0.5">
                      {item.product.price && (
                        <p className="text-[16px] font-bold text-ink">
                          Rp{" "}
                          {Number(item.product.price).toLocaleString("id-ID")}
                        </p>
                      )}
                      {item.product.comparePrice && (
                        <p className="text-[13px] text-ash/50 line-through">
                          Rp{" "}
                          {Number(item.product.comparePrice).toLocaleString(
                            "id-ID",
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="hidden sm:inline-flex items-center gap-1.5 border border-line/60 px-4 py-2 text-[11px] font-medium tracking-wider text-ink/70 hover:text-ink hover:border-ink transition-colors rounded-full"
                    >
                      Lihat
                    </Link>
                    <button
                      type="button"
                      aria-label={`Hapus ${item.product.name} dari favorit`}
                      onClick={() => handleRemove(item.productId)}
                      disabled={isRemoving}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-line/40 text-ash/60 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all group/btn"
                    >
                      <Heart
                        size={16}
                        className="fill-current transition-transform group-hover/btn:scale-90"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
