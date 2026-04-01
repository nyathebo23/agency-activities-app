import  axios from "axios";
import { API_BASE_URL } from "../constants/urls";
import { getStoredToken } from "./storage-service";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

