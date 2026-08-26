import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                    break;
                case 403: console.error('Forbidden access'); break;
                case 404: console.error('Resource not found'); break;
                case 500: console.error('Server error'); break;
                default: console.error('API error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export const weatherAPI = {
    getCurrentWeather: (location) => api.get(`/weather/current/${location}`),
    getForecast: (location, days) => api.get(`/weather/forecast/${location}`, { params: { days } }),
    getHistoricalData: (location, startDate, endDate) =>
        api.get(`/weather/historical/${location}`, { params: { startDate, endDate } }),
};

export const predictionAPI = {
    getPrediction: (location, days) => api.post('/prediction', { location, days }),
    getModelAccuracy: () => api.get('/prediction/accuracy'),
};


export default api;
