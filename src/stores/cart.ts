import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	id: string;
	name: string;
	price: number | null;
	code: string | null;
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
	addItem: (item: Omit<CartItem, "qty">) => void;
	removeItem: (id: string) => void;
	updateQty: (id: string, delta: number) => void;
	clearCart: () => void;
	totalItems: () => number;
	subtotal: () => number;
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
				const existing = get().items.find((i) => i.id === item.id);

				if (existing) {
					set({
						items: get().items.map((i) =>
							i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
						),
						isOpen: true, // Otomatis buka drawer
						lastAddedId: item.id, // Simpan id untuk efek highlight
					});
				} else {
					set({
						items: [...get().items, { ...item, qty: 1 }],
						isOpen: true, // Otomatis buka drawer
						lastAddedId: item.id, // Simpan id untuk efek highlight
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
				get().items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0),
		}),
		{
			name: "alfascorpii-cart",
			// Mencegah status drawer (isOpen) ikut tersimpan ke localStorage
			partialize: (state) => ({ items: state.items }),
		},
	),
);
