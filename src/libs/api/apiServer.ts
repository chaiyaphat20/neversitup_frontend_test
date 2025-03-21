import type { AxiosInstance } from "axios";
import axios from "axios";

const apiServer: AxiosInstance = axios.create({
  baseURL: "/api"
});

export default apiServer;
