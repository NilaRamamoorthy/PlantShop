import api from "./axios";

export const fetchCart = async () => {
  const res = await api.get("/cart/");
  return res.data;
};

export const addToCart = async (plantId, quantity = 1) => {
  const res = await api.post("/cart/items/", {
    plant_id: plantId,
    quantity,
  });
  return res.data;
};

export const updateCartItem = async (itemId, quantity) => {
  const res = await api.patch(`/cart/items/${itemId}/`, {
    quantity,
  });
  return res.data;
};

export const removeCartItem = async (itemId) => {
  const res = await api.delete(`/cart/items/${itemId}/remove/`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/cart/clear/");
  return res.data;
};