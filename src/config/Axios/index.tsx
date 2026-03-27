import axios from "axios";
import API from "@/api";
import { Navigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.timeout = 60 * 1000;
let isRefreshing = false; //isrefreshing
let failedRequests = [];

axios.interceptors.request.use(
  (req) => {
    const accessToken = localStorage.getItem("access");
    const lang = localStorage.getItem("i18nextLng") || "en";
    if (accessToken) {
      if (!req.url?.includes("register")) {
        req.headers["authorization"] = `Bearer ${accessToken}`;
      }
    }
    req.headers["Accept-Language"] = lang;
    return req;
  },
  (err) => {
    console.error("Request interceptor error:", err);
    return Promise.reject(err);
  },
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem("refresh");
      const token = localStorage.getItem("access");

      return new Promise((resolve, reject) => {
        API.Auth.refreshToken({ token, refresh })
          .then((response) => {
            const data = response?.data;
            console.log(response);
            const { access: access } = data;

            localStorage.setItem("access", access);

            axios.defaults.headers.common.Authorization = `Bearer ${access}`;
            originalRequest.headers.Authorization = `Bearer ${access}`;

            resolve(axios(originalRequest));
          })
          .catch((err) => {
            localStorage.clear();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export default axios;
