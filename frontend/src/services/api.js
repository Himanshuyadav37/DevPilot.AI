import axios from "axios";

const api = axios.create({

  baseURL:
    "https://neuroforge-ai.onrender.com"

});

export default api;