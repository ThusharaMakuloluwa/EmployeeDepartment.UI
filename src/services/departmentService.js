import apiClient from "./apiClient";

export const getDepartments = async () => {
  const response = await apiClient.get("/Departments");
  return response.data;
};

export const getDepartmentById = async (id) => {
  const response = await apiClient.get(`/Departments/${id}`);
  return response.data;
};

export const createDepartment = async (department) => {
  const response = await apiClient.post("/Departments", department);
  return response.data;
};

export const updateDepartment = async (id, department) => {
  const response = await apiClient.put(`/Departments/${id}`, department);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await apiClient.delete(`/Departments/${id}`);
  return response.data;
};
