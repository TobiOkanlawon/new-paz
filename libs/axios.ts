import axios from 'axios';

const SS_KEY_FOR_TOKEN = "jwt_token"

const getToken = () => {
  // token is stored in the SessionStorage
  return sessionStorage.getItem(SS_KEY_FOR_TOKEN);
}

export const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
});

<<<<<<< HEAD
const excludeUrl: string[] = [
=======
const publicURLs: string[] = [
>>>>>>> chore/refactor
  '/v1/users/signup',
  '/v1/users/signin',
];

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    const token = getToken();
<<<<<<< HEAD
    const isUrlExcluded = excludeUrl.some((url) => url === config.url);
    if (!isUrlExcluded) {
=======
    const isURLPublic = publicURLs.some((url) => url === config.url);
    if (!isURLPublic) {
>>>>>>> chore/refactor
      if (token && config.headers) {
        config.headers.authorization = `${token}`;
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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    if (error?.response?.status === 400) {
      return Promise.reject({
        message: error.response?.data?.message || 'Something went wrong',
      });
    }
    return Promise.reject(error);
  },
);
