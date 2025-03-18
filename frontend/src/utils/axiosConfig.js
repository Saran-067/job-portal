import axios from "axios";

const API = axios.create({
    baseURL: "https://job-portal-xs9p.onrender.com/api/v1", // Correct base URL
    withCredentials: true, // Ensures cookies are sent with requests
});

export default API;
