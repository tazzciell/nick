import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");

  if (token && tokenType) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }

  return config;
});


export default apiClient;


