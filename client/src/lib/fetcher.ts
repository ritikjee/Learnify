import axios from "axios";
import { cookies } from "next/headers";
import config from "@/config";

const isServer = typeof window === "undefined";

export const fetcher = async (payload: {
  url: string;
  method?: string;
  data?: any;
  headers?: any;
  params?: any;
  responseType?: any;
  onUploadProgress?: any;
  onDownloadProgress?: any;
}) => {
  if (!isServer) {
    throw new Error("fetcher can only be called from the server.");
  }

  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const refreshUrl = `${config.BACKEND_URL.AUTH_SERVICE}/api/token/refresh-token`;

      if (
        error.response?.status === 401 &&
        originalRequest.url !== refreshUrl &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const { data: refreshData } = await axiosInstance({
            method: "GET",
            url: refreshUrl,
            headers: { Cookie: cookieHeader },
          });

          if (refreshData) {
            const newAccessToken = refreshData.access_token;

            // WIP: Store cookies using server

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            originalRequest.headers["Cookie"] = cookieStore
              .getAll()
              .map((cookie) => `${cookie.name}=${cookie.value}`)
              .join("; ");

            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  try {
    const {
      url,
      method = "GET",
      data,
      headers,
      params,
      responseType,
      onUploadProgress,
      onDownloadProgress,
    } = payload;

    const response = await axiosInstance({
      method,
      url,
      data,
      headers: {
        ...headers,
        Cookie: cookieHeader,
      },
      params,
      responseType,
      onUploadProgress,
      onDownloadProgress,
    });

    return {
      data: response.data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data || { message: "Something went wrong" },
    };
  }
};
