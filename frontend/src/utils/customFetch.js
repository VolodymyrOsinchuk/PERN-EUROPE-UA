import axios from "axios";

export const apiUrl = import.meta.env.VITE_APP_API_URL;
const TOKEN_KEY = "authToken";

export const setAuthToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* сховище недоступне: працюватиме cookie */
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

const customFetch = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  withCredentials: true, // cookie як запасний варіант
});

// Додає Bearer-токен до кожного запиту, якщо він є.
customFetch.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default customFetch;
