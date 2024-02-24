import axios from "axios";
import { API_URL } from "@env";

export const API = axios.create({
  baseURL: API_URL,
  // baseURL: "http://192.168.249.106:5000/api/v1",
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};
