import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ===============================
   🔐 AUTO ATTACH TOKEN
================================ */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ===============================
   AUTH APIs
================================ */
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

/* ===============================
   USER PROJECT APIs
================================ */
export const getProjects = () => API.get("/projects");
export const addProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) =>
  API.put(`/projects/${id}`, data);
export const deleteProject = (id) =>
  API.delete(`/projects/${id}`);

/* ===============================
   🔥 ADMIN APIs
================================ */
export const getAdminDashboard = () =>
  API.get("/admin/dashboard");

export const deleteUserByAdmin = (id) =>
  API.delete(`/admin/user/${id}`);

export const deleteProjectByAdmin = (id) =>
  API.delete(`/admin/project/${id}`);

// ✅ THIS WAS MISSING
export const updateProjectStatus = (id, status) =>
  API.put(`/admin/project/${id}/status`, { status });

export default API;
