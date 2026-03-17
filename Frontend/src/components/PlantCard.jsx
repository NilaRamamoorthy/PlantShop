import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toggleWishlist } from "../api/wishlist";
import { addToCart } from "../api/cart";
import { useToast } from "./ToastProvider";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";

const fallbackPlantImage =
  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=500&q=80";

export default function PlantCard({ plant }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const toggleLocal = useWishlistStore((s) => s.toggleLocal);
  const fetchCartCount = useCartStore((s) => s.fetchCartCount);

  const liked = wishlistIds.has(plant.id);

  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      setWishlistLoading(true);
      const res = await toggleWishlist(plant.id);
      toggleLocal(plant.id, res.is_in_wishlist);
      showToast(
        res.is_in_wishlist ? "Added to wishlist" : "Removed from wishlist"
      );
    } catch (error) {
      showToast("Wishlist update failed", "error");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      setAdding(true);
      await addToCart(plant.id, 1);
      await fetchCartCount();
      showToast("Added to cart");
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to add to cart", "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[#dbe7dc] bg-white p-3 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
      <button
        onClick={() => navigate(`/plants/${plant.slug}`)}
        className="w-full text-left"
      >
        <div className="relative rounded-[18px] bg-[#f7faf8] h-[170px] flex items-center justify-center overflow-hidden">
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full border flex items-center justify-center text-lg transition ${
              liked
                ? "bg-[#45AE48] text-white border-[#45AE48] scale-105"
                : "bg-white text-[#0F2A44] border-[#dbe7dc]"
            } disabled:opacity-60`}
          >
            {liked ? "♥" : "♡"}
          </button>

          <img
            src={plant.primary_image || fallbackPlantImage}
            alt={plant.name}
            className="max-h-[140px] max-w-full object-contain"
          />
        </div>

        <div className="mt-4">
          <p className="text-[16px] font-semibold text-[#0F2A44] leading-tight">
            {plant.name}
          </p>

          <p className="mt-1 text-[14px] text-[#5f6b76] line-clamp-1">
            {plant.short_description || plant.category?.name || "Beautiful plant"}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[18px] font-bold text-[#0F2A44]">
                ₹{Number(plant.final_price || plant.price).toFixed(0)}
              </p>

              {plant.discount_price ? (
                <p className="text-[13px] text-[#8a97a5] line-through">
                  ₹{Number(plant.price).toFixed(0)}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className="rounded-full bg-[#45AE48] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-[#38963b] disabled:opacity-60"
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </button>
    </div>
  );
}