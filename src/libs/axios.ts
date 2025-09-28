import useToken from "@/store/tokenStore";
import axios from "axios";
import { toast } from "react-toastify";

export const getToken = (): string | null => {
  return useToken.getState().token;
};

export const storeToken = (token: string) => {
  return useToken.getState().setToken(token);
};

export const removeToken = () => {
  return useToken.getState().removeToken();
};

export const axiosInstance = axios.create({
  // baseURL: process.env.BASE_URL,
  baseURL: "http://54.38.215.158:8080",
});

const publicEndpoints: string[] = ["/v1/users/signup", "/v1/users/signin"];

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    const token = getToken();
    const isUrlExcluded = publicEndpoints.some((url) => url === config.url);
    if (!isUrlExcluded) {
      if (token && config.headers) {
        config.headers.authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      toast.error("An error occured");
    }
  },
);
