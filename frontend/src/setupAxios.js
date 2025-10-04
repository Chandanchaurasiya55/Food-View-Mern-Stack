import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

// Configure axios defaults for the app
axios.defaults.baseURL = API_URL;
// Always send cookies so server-set token cookie is sent with requests
axios.defaults.withCredentials = true;

export default axios;
