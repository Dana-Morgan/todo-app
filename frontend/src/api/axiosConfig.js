import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.get('/csrf-token').then(response => {
    api.defaults.headers['X-CSRF-Token'] = response.data.csrfToken;
});

export default api;
