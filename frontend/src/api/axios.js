import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1"
});

export default api;

export const generateCode = async (data) => {
    const response = await api.post("/generate", data);
    return response.data;
};

export const analyzeCode = async (data) => {
    const response = await api.post("/analyze", data);
    return response.data;
};

export const getHistory = async () => {
    const response = await api.get("/history");
    return response.data;
};