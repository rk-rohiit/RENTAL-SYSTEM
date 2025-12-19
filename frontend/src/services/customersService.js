import api from "../api/api";

export const getCustomers = () => api.get("/customers");
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const deleteAllCustomers = () => api.delete(`/customers/delete/all`);
export const searchCustomers = (keyword) => api.get(`/customers/search/${keyword}`);
