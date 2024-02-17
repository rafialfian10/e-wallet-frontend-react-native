import axios from 'axios'
import { API_URL } from "@env";

export const API = axios.create({
    baseURL: API_URL,
})

export const setAuthToken = (token) => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common["Authorization"];
    }
};
