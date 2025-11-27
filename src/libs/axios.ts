import axios from "axios";
import { toast } from "react-toastify";
import { getToken, removeToken } from "@/libs/auth";

export const axiosInstance = axios.create({
  // baseURL: process.env.BASE_URL,
  baseURL: "https://backend.mypazfinance.com",
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
    const data = error?.response?.data;

    // this handles the case where the token expires.
    // The backend, currently, returns a JSON with the following fields
    // responseCode, 400
    // responseMessage, "invalid token provided"

    if (
      data.responseCode === 400 &&
      data.responseMessage == "invalid token provided"
    ) {
      window.dispatchEvent(new Event("logout"))
    }

    if (!error.response) {
      toast.error("An error occured");
    }
    return Promise.reject(data);
  },
);
