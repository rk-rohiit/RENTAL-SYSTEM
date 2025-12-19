import api from "../api/api";

// ✅ Get all vehicles
export const getVehicles = () => api.get("/vehicles");

// ✅ Get single vehicle by ID
export const getVehicle = (id) => api.get(`/vehicles/${id}`);

// ✅ Create vehicle
export const createVehicle = (data) => api.post("/vehicles", data);

// ✅ Update vehicle
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);

// ✅ Delete vehicle
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// ✅ Search vehicles (keyword may include space → encode it)
export const searchVehicles = (keyword) =>
  api.get(`/vehicles/search/${encodeURIComponent(keyword)}`);

// ✅ Filter vehicles (type + availability)
export const filterVehicles = (type, availability) =>
  api.get(
    `/vehicles/filter?type=${encodeURIComponent(type)}&availability=${encodeURIComponent(
      availability
    )}`
  );

// ✅ Sort vehicles
export const sortVehicles = (key) =>
  api.get(`/vehicles/sort/${encodeURIComponent(key)}`);
