import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

/* ================= DASHBOARD STATS ================= */
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};

/* ================= CUSTOMERS LIST ================= */
export const getDashboardCustomers = async () => {
  const response = await axios.get(`${API_URL}/customers`);
  return response.data;
};

/* ================= VEHICLES LIST ================= */
export const getDashboardVehicles = async () => {
  const response = await axios.get(`${API_URL}/vehicles`);
  return response.data;
};
