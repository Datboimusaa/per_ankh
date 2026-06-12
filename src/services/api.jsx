import axios from 'axios';

const base_url = 'http://localhost:5050'

const api = axios.create({
    baseURL: base_url,
    withCredentials: true
});

export default api