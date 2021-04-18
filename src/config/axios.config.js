import axios from 'axios';
const baseURL = `http://localhost:3030/api`;
export const apiUrl = baseURL;
axios.defaults.baseURL = apiUrl;

export default axios;