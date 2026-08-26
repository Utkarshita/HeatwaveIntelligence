export const APP_CONSTANTS = {
    APP_NAME: 'Heatwave Intelligence System',
    APP_VERSION: '1.0.0',
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    DEFAULT_LOCATION: 'Delhi',
    MAX_TEMP_THRESHOLD: 40,
    CRITICAL_TEMP_THRESHOLD: 45,
    WARNING_TEMP_THRESHOLD: 38,
    ALERT_REFRESH_INTERVAL: 300000,
};

export const SEVERITY_LEVELS = {
    HIGH: { value: 'high', label: 'High', color: 'bg-red-100 text-red-800', priority: 3 },
    MEDIUM: { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-800', priority: 2 },
    LOW: { value: 'low', label: 'Low', color: 'bg-yellow-100 text-yellow-800', priority: 1 },
};

export const ALERT_TYPES = {
    CRITICAL: { value: 'critical', label: 'Critical', icon: '🚨' },
    WARNING: { value: 'warning', label: 'Warning', icon: '⚠️' },
    INFO: { value: 'info', label: 'Info', icon: 'ℹ️' },
};

export const CHART_COLORS = {
    primary: 'rgb(239, 68, 68)',
    secondary: 'rgb(59, 130, 246)',
    warning: 'rgb(251, 146, 60)',
    success: 'rgb(34, 197, 94)',
    danger: 'rgb(239, 68, 68)',
    background: 'rgba(239, 68, 68, 0.1)',
};

export const API_ENDPOINTS = {
    WEATHER: { CURRENT: '/weather/current', FORECAST: '/weather/forecast', HISTORICAL: '/weather/historical' },
    PREDICTION: { PREDICT: '/prediction', ACCURACY: '/prediction/accuracy' },
    ALERTS: { BASE: '/alerts', CREATE: '/alerts', UPDATE: '/alerts/:id', DELETE: '/alerts/:id' },
    ANALYSIS: { STATISTICS: '/analysis/statistics', CORRELATIONS: '/analysis/correlations', TRENDS: '/analysis/trends' },
};
