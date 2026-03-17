import { useEffect, useMemo, useState } from "react";
import MobileFrame from "../components/MobileFrame";
import BottomNav from "../components/BottomNav";
import PlantCard from "../components/PlantCard";
import DragScrollRow from "../components/DragScrollRow";
import { fetchBanners, fetchCategories, fetchPlants } from "../api/plants";

const fallbackBannerImage =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=500&q=80";

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [categories, setCategories] = useState([]);
  const [plants, setPlants] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadPlants();
  }, [activeCategory]);

  const loadInitialData = async () => {
    try {
      const [categoryData, bannerData] = await Promise.all([
        fetchCategories(),
        fetchBanners(),
      ]);

      setCategories(categoryData || []);
      setBanners(bannerData || []);
    } catch (error) {
      console.error("Failed to load initial home data", error);
    }
  };

  const loadPlants = async () => {
    try {
      setLoading(true);
      const plantData = await fetchPlants({ category: activeCategory });
      setPlants(plantData || []);
    } catch (error) {
      console.error("Failed to load plants", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlants = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return plants;

    return plants.filter((plant) => {
      return (
        plant.name?.toLowerCase().includes(query) ||
        plant.short_description?.toLowerCase().includes(query) ||
        plant.category?.name?.toLowerCase().includes(query)
      );
    });
  }, [plants, searchText]);

  const banner = banners[0];

  return (
    <MobileFrame>
      <div className="min-h-[100svh] bg-white flex flex-col">
        <div className="flex-1 px-4 sm:px-5 pt-8 pb-24">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] text-[#5f6b76]">Good day</p>
              <h1 className="mt-1 text-[20px] font-bold text-[#0F2A44]">
                {user.full_name ? `Hi, ${user.full_name}` : "Find your plants"}
              </h1>
            </div>

            <div className="w-11 h-11 rounded-full bg-[#f4f8fb] border border-[#e8eef3] flex items-center justify-center text-[#0F2A44] text-lg font-semibold">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-[20px] leading-tight font-bold text-[#0F2A44]">
              Find your
              <br />
              favorite plant
            </h2>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 rounded-full border border-[#d7e1ea] bg-[#f7fafc] px-4 py-3">
              <input
                type="text"
                placeholder="Search plants"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-transparent outline-none text-[16px] text-[#0F2A44] placeholder:text-[#8a97a5]"
              />
            </div>

            <button className="w-12 h-12 rounded-full bg-[#45AE48] text-white text-xl flex items-center justify-center">
              ⌕
            </button>
          </div>

          <div className="mt-6 rounded-[24px] bg-[#0F2A44] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-5">
              <div className="text-white">
                <p className="text-[20px] font-bold leading-tight">
                  {banner?.title || "30% Off"}
                </p>
                <p className="mt-1 text-[16px] text-white/85">
                  {banner?.subtitle || "Special offer on indoor plants"}
                </p>
                <button className="mt-4 rounded-full bg-[#00A6ED] px-4 py-2 text-[14px] font-semibold text-white">
                  Shop now
                </button>
              </div>

              <img
                src={banner?.image || fallbackBannerImage}
                alt="banner"
                className="w-[92px] h-[92px] rounded-[18px] object-cover"
              />
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#0F2A44]">
                Categories
              </h3>
              <button
                onClick={() => setActiveCategory("all")}
                className="text-[14px] font-medium text-[#00A6ED]"
              >
                Reset
              </button>
            </div>

            <DragScrollRow className="mt-4 pb-1">
              <div className="flex gap-3 w-max">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium border transition ${
                    activeCategory === "all"
                      ? "bg-[#0F2A44] text-white border-[#0F2A44]"
                      : "bg-white text-[#0F2A44] border-[#d7e1ea]"
                  }`}
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.slug)}
                    className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-medium border transition ${
                      activeCategory === category.slug
                        ? "bg-[#0F2A44] text-white border-[#0F2A44]"
                        : "bg-white text-[#0F2A44] border-[#d7e1ea]"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </DragScrollRow>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-[#0F2A44]">
                Plants
              </h3>
              <p className="text-[14px] text-[#5f6b76]">
                {filteredPlants.length} items
              </p>
            </div>

            {loading ? (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-[#e8eef3] bg-white p-3 shadow-sm"
                  >
                    <div className="h-[170px] rounded-[18px] bg-[#f4f8fb] animate-pulse" />
                    <div className="mt-4 h-4 rounded bg-[#f4f8fb] animate-pulse" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-[#f4f8fb] animate-pulse" />
                    <div className="mt-4 h-10 rounded-full bg-[#f4f8fb] animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredPlants.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#d7e1ea] bg-[#f7fafc] p-6 text-center">
                <p className="text-[16px] font-medium text-[#0F2A44]">
                  No plants found
                </p>
                <p className="mt-2 text-[14px] text-[#5f6b76]">
                  Try another search or category.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {filteredPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}