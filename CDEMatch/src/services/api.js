import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { navigationRef } from "./navigationRef.js";
import { Platform } from "react-native";

const port = 3000;

const api = axios.create({
  // baseURL: `http://192.168.1.72:${port}`,
  baseURL: "https://clubedoempreendedor.alwaysdata.net/",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !error.config.url.includes("login")
    ) {
      console.log(
        "Token inválido ou inexistente. Redirecionando para Login...",
      );

      await AsyncStorage.removeItem("userToken");

      if (Platform.OS === "web") {
        window.location.replace("/cdematch/login");
      } else {
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      }
      return new Promise(() => {});
    }

    return Promise.reject(error);
  },
);

export default api;
