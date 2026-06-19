import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("dp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("dp_token");
      localStorage.removeItem("dp_user");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => client.post("/auth/register", data),
  login: (data) => client.post("/auth/login", data),
};

export const projectAPI = {
  run: (task) => client.post("/project/run", { task }),
  getStatus: (runId) => client.get(`/status/${runId}`),
  getHistory: () => client.get("/history/"),
};

export default client;