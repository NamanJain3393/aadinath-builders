import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',  // Uses proxy locally if empty, provided URL in prod
});

export default instance;
