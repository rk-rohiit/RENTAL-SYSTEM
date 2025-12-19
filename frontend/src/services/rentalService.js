import api from "../api/api";

// Customers
export const getCustomers = () => api.get("/customers");

// Vehicles available only
export const getVehiclesAvailable = () => api.get("/vehicles/available");

// Create rental
export const createRental = (data) => api.post("/rentals", data);

// Rentals join
export const getRentalsJoin = () => api.get("/rentals/join");

// Delete rental
export const deleteRental = (id) => api.delete(`/rentals/${id}`);

// updateRentalStatus
export const updateRentalStatus = (id, data) =>
  api.put(`/rentals/${id}`, data);