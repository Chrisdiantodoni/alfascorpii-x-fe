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
			addItem: (item) => {
				const existing = get().items.find((i) => i.id === item.id);
				if (existing) {
					set({
						items: get().items.map((i) =>
							i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
						),
					});
				} else {
					set({ items: [...get().items, { ...item, qty: 1 }] });
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
		{ name: "alfascorpii-cart" },
	),
);
