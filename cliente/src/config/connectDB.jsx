import axios from "axios";

const API_URL = "https://6a41deb87602860e65207a7c.mockapi.io";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;