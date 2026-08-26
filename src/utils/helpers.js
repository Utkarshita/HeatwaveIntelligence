export const formatTemperature = (temp) => `${Math.round(temp)}°C`;

export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
});

export const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
});

export const getSeverityFromTemp = (temp) => {
    if (temp >= 45) return { label: 'Critical', color: 'bg-red-600', severity: 'high' };
    if (temp >= 40) return { label: 'Warning', color: 'bg-orange-500', severity: 'medium' };
    if (temp >= 35) return { label: 'Caution', color: 'bg-yellow-500', severity: 'low' };
    return { label: 'Normal', color: 'bg-green-500', severity: 'none' };
};

export const calculateConfidenceInterval = (data, confidence = 0.95) => {
    if (!data || data.length === 0) return null;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
    const margin = 1.96 * (stdDev / Math.sqrt(data.length));
    return { mean, lower: mean - margin, upper: mean + margin };
};

export const getRandomColor = () => {
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const truncateText = (text, maxLength = 100) =>
    text.length <= maxLength ? text : text.substring(0, maxLength) + '...';

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const isWithinThreshold = (value, threshold, type = 'high') => {
    if (type === 'high') return value >= threshold;
    if (type === 'low') return value <= threshold;
    return false;
};

export const getAlertSeverityClasses = (severity) => {
    switch (severity) {
        case 'high': return 'bg-red-50 border-red-200 text-red-800';
        case 'medium': return 'bg-orange-50 border-orange-200 text-orange-800';
        case 'low': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
};
