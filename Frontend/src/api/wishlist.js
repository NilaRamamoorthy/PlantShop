import api from "./axios";

export const getWishlist = async () => {
  const res = await api.get("/auth/wishlist/");
  return res.data;
};

export const fetchWishlist = getWishlist;

export const toggleWishlist = async (plantId) => {
  const res = await api.post("/auth/wishlist/toggle/", {
    plant_id: plantId,
  });
  return res.data;
};