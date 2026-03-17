import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import { fetchPlantDetail } from "../api/plants";
import { addToCart } from "../api/cart";
import { toggleWishlist } from "../api/wishlist";
import { useToast } from "../components/ToastProvider";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartStore } from "../store/cartStore";

const fallbackPlantImage =
  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=700&q=80";

function SpecCard({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[#dbe7dc] bg-white px-4 py-4 text-center shadow-sm">
      <p className="text-[13px] text-[#7c8995]">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-[#0F2A44]">{value || "-"}</p>
    </div>
  );
}

export default function PlantDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const toggleLocal = useWishlistStore((s) => s.toggleLocal);
  const fetchCartCount = useCartStore((s) => s.fetchCartCount);

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const liked = plant ? wishlistIds.has(plant.id) : false;

  useEffect(() => {
    loadPlant();
  }, [slug]);

  const loadPlant = async () => {
    try {
      setLoading(true);
      const data = await fetchPlantDetail(slug);
      setPlant(data);

      const firstImage =
        data?.images?.find((img) => img.is_primary)?.image ||
        data?.primary_image ||
        data?.images?.[0]?.image ||
        "";

      setActiveImage(firstImage);
    } catch (error) {
      console.error("Failed to load plant detail", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!plant) return;

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

  const handleAddToCart = async () => {
    if (!plant) return;

    try {
      setAddingToCart(true);
      await addToCart(plant.id, 1);
      await fetchCartCount();
      showToast("Added to cart");
      navigate("/cart");
    } catch (error) {
      showToast(error?.response?.data?.error || "Failed to add to cart", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const galleryImages = useMemo(() => {
    if (!plant) return [];
    const all = [
      ...(plant.primary_image ? [plant.primary_image] : []),
      ...(plant.images?.map((img) => img.image) || []),
    ];
    return [...new Set(all.filter(Boolean))];
  }, [plant]);

  if (loading) {
    return (
      <MobileFrame>
        <div className="min-h-[100svh] bg-[#f8fbfd] px-4 pt-8 pb-8">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-full bg-[#e9f0f5] animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-[#e9f0f5] animate-pulse" />
          </div>

          <div className="mt-6 h-[320px] rounded-[28px] bg-[#e9f0f5] animate-pulse" />
          <div className="mt-6 h-6 w-2/3 rounded bg-[#e9f0f5] animate-pulse" />
          <div className="mt-3 h-4 w-full rounded bg-[#e9f0f5] animate-pulse" />
          <div className="mt-2 h-4 w-5/6 rounded bg-[#e9f0f5] animate-pulse" />

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 rounded-[18px] bg-[#e9f0f5] animate-pulse"
              />
            ))}
          </div>

          <div className="mt-8 h-14 rounded-full bg-[#e9f0f5] animate-pulse" />
        </div>
      </MobileFrame>
    );
  }

  if (!plant) {
    return (
      <MobileFrame>
        <div className="min-h-[100svh] bg-white px-5 pt-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border border-[#d7e1ea] text-[#0F2A44]"
          >
            ←
          </button>

          <div className="mt-12 rounded-[24px] border border-dashed border-[#d7e1ea] bg-[#f7fafc] p-6 text-center">
            <p className="text-[18px] font-semibold text-[#0F2A44]">
              Plant not found
            </p>
            <p className="mt-2 text-[14px] text-[#5f6b76]">
              This plant may have been removed or is unavailable.
            </p>
          </div>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-[#f8fbfd] flex flex-col">
        <div className="px-4 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-full bg-white border border-[#dbe7dc] text-[#0F2A44] text-xl shadow-sm"
            >
              ←
            </button>

            <button
              onClick={handleToggleWishlist}
              disabled={wishlistLoading}
              className={`w-11 h-11 rounded-full border text-xl shadow-sm flex items-center justify-center transition ${
                liked
                  ? "bg-[#45AE48] text-white border-[#45AE48] scale-105"
                  : "bg-white text-[#0F2A44] border-[#dbe7dc]"
              } disabled:opacity-60`}
            >
              {liked ? "♥" : "♡"}
            </button>
          </div>

          <div className="mt-5 rounded-[30px] bg-white border border-[#dbe7dc] p-5 shadow-sm">
            <div className="h-[300px] sm:h-[340px] flex items-center justify-center rounded-[24px] bg-[#f4f7f5] overflow-hidden">
              <img
                src={activeImage || fallbackPlantImage}
                alt={plant.name}
                className="max-h-[260px] sm:max-h-[300px] max-w-full object-contain"
              />
            </div>

            {galleryImages.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
                {galleryImages.map((image, index) => {
                  const isActive = image === activeImage;
                  return (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setActiveImage(image)}
                      className={`shrink-0 w-16 h-16 rounded-[16px] overflow-hidden border-2 ${
                        isActive ? "border-[#45AE48]" : "border-[#dbe7dc]"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${plant.name}-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[22px] font-bold leading-tight text-[#0F2A44]">
                  {plant.name}
                </p>
                <p className="mt-1 text-[14px] text-[#5f6b76]">
                  {plant.category?.name || "Plant"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[22px] font-bold text-[#0F2A44]">
                  ₹{Number(plant.final_price || plant.price).toFixed(0)}
                </p>

                {plant.discount_price ? (
                  <p className="mt-1 text-[14px] text-[#8a97a5] line-through">
                    ₹{Number(plant.price).toFixed(0)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-[#45AE48] text-[16px]">★</span>
              <span className="text-[14px] font-medium text-[#0F2A44]">
                {plant.rating_avg || "0.0"}
              </span>
              <span className="text-[14px] text-[#7c8995]">
                ({plant.rating_count || 0} reviews)
              </span>
            </div>

            <p className="mt-5 text-[16px] font-semibold text-[#0F2A44]">
              Overview
            </p>
            <p className="mt-2 text-[15px] leading-7 text-[#5f6b76]">
              {plant.description ||
                plant.short_description ||
                "A beautiful plant for your indoor and outdoor spaces."}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <SpecCard label="Size" value={plant.size} />
              <SpecCard label="Height" value={plant.height} />
              <SpecCard label="Humidity" value={plant.humidity} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <SpecCard label="Light" value={plant.light_requirement} />
              <SpecCard label="Water" value={plant.water_requirement} />
            </div>

            <div className="mt-6 rounded-[22px] bg-white border border-[#dbe7dc] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] text-[#7c8995]">Stock</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#0F2A44]">
                    {plant.stock > 0 ? `${plant.stock} available` : "Out of stock"}
                  </p>
                </div>

                <div>
                  <p className="text-[14px] text-[#7c8995]">Pet Friendly</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#0F2A44]">
                    {plant.pet_friendly ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto sticky bottom-0 bg-white border-t border-[#dbe7dc] px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="w-14 h-14 rounded-full border border-[#dbe7dc] bg-[#f8fbfd] text-[#0F2A44] text-xl"
            >
              🛒
            </button>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || plant.stock < 1}
              className="flex-1 h-14 rounded-full bg-[#45AE48] text-white text-[16px] font-semibold shadow-sm disabled:opacity-60"
            >
              {plant.stock < 1 ? "Out of Stock" : addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}