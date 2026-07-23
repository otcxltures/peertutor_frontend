import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/login/refresh/`, { refresh });
          localStorage.setItem("access", res.data.access);
          original.headers.Authorization = `Bearer ${res.data.access}`;
          return client(original);
        } catch {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
