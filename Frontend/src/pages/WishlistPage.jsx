import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "../components/MobileFrame";
import BottomNav from "../components/BottomNav";
import { getWishlist, toggleWishlist } from "../api/wishlist";

const fallbackPlantImage =
  "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=500&q=80";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setItems(data || []);
    } catch (error) {
      console.error("Failed to load wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (plantId) => {
    try {
      await toggleWishlist(plantId);
      setItems((prev) => prev.filter((item) => item.plant.id !== plantId));
    } catch (error) {
      console.error("Failed to remove wishlist item", error);
    }
  };

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-white flex flex-col">
        <div className="flex-1 px-5 pt-8 pb-24">
          <h1 className="text-[20px] font-bold text-[#0F2A44]">Wishlist</h1>
          <p className="mt-2 text-[14px] text-[#5f6b76]">
            Your saved plants
          </p>

          {loading ? (
            <p className="mt-6 text-[#5f6b76]">Loading wishlist...</p>
          ) : items.length === 0 ? (
            <div className="mt-10 rounded-[28px] border border-dashed border-[#dbe7dc] bg-[#f7faf8] p-8 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-[#eaf7eb] flex items-center justify-center text-[34px] text-[#45AE48]">
                ♥
              </div>

              <p className="mt-5 text-[18px] font-semibold text-[#0F2A44]">
                Your wishlist is empty
              </p>

              <p className="mt-2 text-[14px] leading-6 text-[#5f6b76]">
                Save your favorite plants here and come back to them anytime.
              </p>

              <button
                onClick={() => navigate("/home")}
                className="mt-6 rounded-full bg-[#45AE48] px-5 py-3 text-[14px] font-semibold text-white"
              >
                Explore Plants
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-[#e8eef3] bg-white p-4 shadow-sm flex gap-4"
                >
                  <button onClick={() => navigate(`/plants/${item.plant.slug}`)}>
                    <img
                      src={item.plant.primary_image || fallbackPlantImage}
                      alt={item.plant.name}
                      className="w-20 h-20 rounded-[16px] object-cover bg-[#f4f8fb]"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate(`/plants/${item.plant.slug}`)}
                      className="text-left"
                    >
                      <p className="text-[16px] font-semibold text-[#0F2A44]">
                        {item.plant.name}
                      </p>
                    </button>

                    <p className="mt-1 text-[14px] text-[#5f6b76] line-clamp-2">
                      {item.plant.short_description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-[18px] font-bold text-[#0F2A44]">
                        ₹{Number(item.plant.final_price || item.plant.price).toFixed(0)}
                      </p>

                      <button
                        onClick={() => handleRemove(item.plant.id)}
                        className="rounded-full border border-[#d7e1ea] px-4 py-2 text-[14px] font-medium text-[#0F2A44]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    </MobileFrame>
  );
}