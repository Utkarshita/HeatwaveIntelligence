// Alert service - placeholder for alert-specific business logic
import { alertAPI } from './api';

export const alertService = {
    getActiveAlerts: async () => {
        try {
            const alerts = await alertAPI.getAlerts();
            return Array.isArray(alerts) ? alerts.filter(a => a.status === 'active') : [];
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
            return [];
        }
    },

    createHeatwaveAlert: async (location, severity, temp) => {
        const alertData = {
            type: severity === 'high' ? 'critical' : severity === 'medium' ? 'warning' : 'info',
            message: `Temperature of ${temp}°C detected at ${location}`,
            location,
            severity,
        };
        return alertAPI.createAlert(alertData);
    },
};

export default alertService;
