import { create } from "zustand";
import { getWishlist } from "../api/wishlist";

export const useWishlistStore = create((set) => ({
  wishlistIds: new Set(),
  loading: false,

  fetchWishlist: async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        set({ wishlistIds: new Set(), loading: false });
        return;
      }

      set({ loading: true });
      const data = await getWishlist();
      const ids = new Set(data.map((item) => item.plant.id));
      set({ wishlistIds: ids });
    } catch (error) {
      console.error("Failed to load wishlist", error);
    } finally {
      set({ loading: false });
    }
  },

  toggleLocal: (plantId, isInWishlist) =>
    set((state) => {
      const updated = new Set(state.wishlistIds);

      if (isInWishlist) {
        updated.add(plantId);
      } else {
        updated.delete(plantId);
      }

      return { wishlistIds: updated };
    }),

  resetWishlist: () => set({ wishlistIds: new Set(), loading: false }),
}));