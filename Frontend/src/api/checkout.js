import api from "./axios";

export const fetchAddresses = async () => {
  const res = await api.get("/auth/addresses/");
  return res.data;
};

export const createAddress = async (payload) => {
  const res = await api.post("/auth/addresses/", payload);
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

export const previewCheckout = async (payload) => {
  const res = await api.post("/orders/checkout/preview/", payload);
  return res.data;
};

export const placeOrder = async (payload) => {
  const res = await api.post("/orders/", payload);
  return res.data;
};