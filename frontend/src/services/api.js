import axios from "axios";
const API = axios.create({
  baseURL: "https://codealpha-appdev-fittrack.onrender.com/api",
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Activities
export const logActivity = (data) => API.post("/activities", data);
export const getAllActivities = () => API.get("/activities");
export const getTodayActivities = () => API.get("/activities/today");
export const getDailySummary = (date) =>
  API.get(`/activities/summary/daily${date ? `?date=${date}` : ""}`);
export const getWeeklySummary = () => API.get("/activities/summary/weekly");
export const deleteActivity = (id) => API.delete(`/activities/${id}`);
export const getGoals = () => API.get("/users/goals");
export const updateGoals = (data) => API.put("/users/goals", data);
export default API;
