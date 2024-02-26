import axios from "axios";

export const axiosAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: {
    "Content-type": "application/json"
  },
  withCredentials: true,
});