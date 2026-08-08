import axios from "axios";

// URL de tu backend Express. En desarrollo usa localhost por defecto.
// En producción, defínela en Vercel/Netlify como VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta automáticamente el JWT (guardado tras el login con Google) en cada request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend responde 401 (token vencido/ inválido), se cierra la sesión local
// y se manda al usuario de vuelta al login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
