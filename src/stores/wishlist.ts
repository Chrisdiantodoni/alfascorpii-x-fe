// owned by: italfa:staff
import { create } from "zustand";
import { addWishlist, getWishlistIds, removeWishlist } from "#/server/wishlist";

type WishlistState = {
	ids: string[];
	loaded: boolean;
	load: () => Promise<void>;
	isFavorite: (productId: string) => boolean;
	toggle: (productId: string) => Promise<void>;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
	ids: [],
	loaded: false,
	load: async () => {
		if (get().loaded) return;
		const ids = await getWishlistIds();
		set({ ids, loaded: true });
	},
	isFavorite: (productId) => get().ids.includes(productId),
	toggle: async (productId) => {
		const { ids } = get();
		const has = ids.includes(productId);
		const next = has
			? ids.filter((id) => id !== productId)
			: [...ids, productId];
		set({ ids: next });
		if (has) {
			await removeWishlist({ data: { productId } });
		} else {
			await addWishlist({ data: { productId } });
		}
	},
}));
