import axios from "../api/axios";

// Get joined payments + rentals + customers + vehicles
export const getPaymentsJoin = () => {
  return axios.get("/payments/join");
};

// Get rentals joined with customer + vehicle for the dropdown
export const getRentalsJoin = () => {
  return axios.get("/rentals/join");
};

// Create payment
export const createPayment = (data) => {
  return axios.post("/payments", data);
};

// Delete single payment
export const deletePayment = (id) => {
  return axios.delete(`/payments/${id}`);
};

// Delete ALL payments
export const deleteAllPayments = () => {
  return axios.delete("/payments");
};

// Search payments
export const searchPayments = (keyword) => {
  return axios.get(`/payments/search/${keyword}`);
};
