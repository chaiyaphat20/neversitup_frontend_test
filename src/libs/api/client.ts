import type { AxiosInstance } from "axios";
import axios from "axios";

const fetchApi: AxiosInstance = axios.create({
  baseURL: "/api"
});

export default fetchApi;
