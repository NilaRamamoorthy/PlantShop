import api from "./axios";

export const fetchCategories = async () => {
  const res = await api.get("/categories/");
  return res.data;
};

export const fetchPlants = async (params = {}) => {
  const searchParams = new URLSearchParams();

  if (params.category && params.category !== "all") {
    searchParams.append("category", params.category);
  }

  if (params.search) {
    searchParams.append("search", params.search);
  }

  if (params.featured) {
    searchParams.append("featured", "true");
  }

  const query = searchParams.toString();
  const url = query ? `/plants/?${query}` : "/plants/";

  const res = await api.get(url);
  return res.data;
};

export const fetchPlantDetail = async (slug) => {
  const res = await api.get(`/plants/${slug}/`);
  return res.data;
};

export const fetchBanners = async () => {
  const res = await api.get("/banners/");
  return res.data;
};