import axios from "axios";
const apiUrl = import.meta.env.VITE_APP_API_URL;

const customFetch = axios.create({
  baseURL: `${apiUrl}/api/v1`,
});

customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur Axios:", error);
    return Promise.reject(error);
  }
);

export default customFetch;
