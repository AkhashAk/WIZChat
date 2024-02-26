import axios from "axios";

export const axiosAPI = axios.create({
  // baseURL: "https://ylqz0rb9xf.execute-api.us-east-1.amazonaws.com/user",
  // baseURL: "https://64db5b59593f57e435b0d352.mockapi.io/users",
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: {
    "Content-type": "application/json"
  },
  withCredentials: true,
});