import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7015/api",
});

export default apiClient;
