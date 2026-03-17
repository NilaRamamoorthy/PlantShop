import { create } from "zustand";
import { fetchCart } from "../api/cart";

export const useCartStore = create((set) => ({
  cartCount: 0,
  loading: false,

  fetchCartCount: async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        set({ cartCount: 0, loading: false });
        return;
      }

      set({ loading: true });
      const data = await fetchCart();

      const count = (data?.items || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      set({ cartCount: count });
    } catch (error) {
      console.error("Failed to load cart count", error);
    } finally {
      set({ loading: false });
    }
  },

  setCartCountFromCart: (cart) =>
    set(() => {
      const count = (cart?.items || []).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return { cartCount: count };
    }),

  resetCartCount: () => set({ cartCount: 0, loading: false }),
}));