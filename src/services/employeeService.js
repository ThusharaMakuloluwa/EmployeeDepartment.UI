import apiClient from "./apiClient";

export const getEmployees = async () => {
  const response = await apiClient.get("/Employees");
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await apiClient.get(`/Employees/${id}`);
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await apiClient.post("/Employees", employee);
  return response.data;
};

export const updateEmployee = async (id, employee) => {
  const response = await apiClient.put(`/Employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await apiClient.delete(`/Employees/${id}`);
  return response.data;
};
