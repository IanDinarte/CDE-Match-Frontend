import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const port = 3000;

const api = axios.create({
  baseURL: `http://192.168.1.72:${port}`,
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

export default api;
