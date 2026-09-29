import axios from "axios";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://eventsphere-backend-mocha.vercel.app"
).replace(/\/+$/, "");

export const getApiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const getImageUrl = (value) => {
  if (!value) {
    return "";
  }

  // Cloudinary / external URL
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return getApiUrl(value.replace(/^\/+/, ""));
};

axios.defaults.baseURL = API_BASE_URL;

// IMPORTANT:
// Do NOT set:
// axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    // For FormData, browser/Axios must automatically
    // create multipart/form-data boundary.
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;