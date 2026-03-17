import api from "./axios";

export const fetchProfile = async () => {
  const res = await api.get("/auth/profile/");
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.patch("/auth/profile/", payload);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await api.get("/orders/list/");
  return res.data;
};

export const fetchOrderDetail = async (orderId) => {
  const res = await api.get(`/orders/${orderId}/`);
  return res.data;
};

export const fetchAddresses = async () => {
  const res = await api.get("/auth/addresses/");
  return res.data;
};

export const createAddress = async (payload) => {
  const res = await api.post("/auth/addresses/", payload);
  return res.data;
};

export const updateAddress = async (id, payload) => {
  const res = await api.patch(`/auth/addresses/${id}/`, payload);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await api.delete(`/auth/addresses/${id}/`);
  return res.data;
};

export const fetchPaymentMethods = async () => {
  const res = await api.get("/auth/payment-methods/");
  return res.data;
};

export const createPaymentMethod = async (payload) => {
  const res = await api.post("/auth/payment-methods/", payload);
  return res.data;
};

export const updatePaymentMethod = async (id, payload) => {
  const res = await api.patch(`/auth/payment-methods/${id}/`, payload);
  return res.data;
};

export const deletePaymentMethod = async (id) => {
  const res = await api.delete(`/auth/payment-methods/${id}/`);
  return res.data;
};