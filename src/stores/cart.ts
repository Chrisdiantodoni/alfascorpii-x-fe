import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartColor {
  id: string;
  name: string;
  hex: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number | null;
  code: string | null;
  color: CartColor | null;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  lastAddedId: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearLastAdded: () => void;
  addItem: (item: {
    productId: string;
    name: string;
    price: number | null;
    code: string | null;
    color: CartColor | null;
  }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export function lineId(productId: string, color: CartColor | null) {
  return `${productId}|${color?.id ?? "default"}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedId: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      clearLastAdded: () => set({ lastAddedId: null }),

      addItem: (item) => {
        const id = lineId(item.productId, item.color);
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, qty: i.qty + 1 } : i,
            ),
            isOpen: true, // Otomatis buka drawer
            lastAddedId: id, // Simpan id untuk efek highlight
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                id,
                productId: item.productId,
                name: item.name,
                price: item.price,
                code: item.code,
                color: item.color,
                qty: 1,
              },
            ],
            isOpen: true, // Otomatis buka drawer
            lastAddedId: id, // Simpan id untuk efek highlight
          });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, delta) =>
        set({
          items: get()
            .items.map((i) =>
              i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i,
            )
            .filter((i) => i.qty > 0),
        }),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

      subtotal: () =>
        get().items?.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0),
    }),
    {
      name: "alfascorpii-cart",
      // Mencegah status drawer (isOpen) ikut tersimpan ke localStorage
      partialize: (state) => ({ items: state.items }),
      // Migrasi item lama (sebelum fitur warna) ke format line id komposit
      merge: (persisted, current) => {
        const state = {
          ...(current as CartStore),
          ...(persisted as Partial<CartStore>),
        };
        const persistedItems = (persisted as Partial<CartStore>)?.items;
        if (persistedItems) {
          state.items = persistedItems.map((item) => {
            if (item.productId && item.color !== undefined) return item;
            const productId =
              item.productId ?? (item.id.split("|")[0] as string);
            return {
              ...item,
              id: lineId(productId, item.color ?? null),
              productId,
              color: item.color ?? null,
            };
          });
        }
        return state;
      },
    },
  ),
);
