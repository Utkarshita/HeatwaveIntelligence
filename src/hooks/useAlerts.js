import { useState, useEffect, useCallback } from 'react';
import { alertAPI } from '../services/api';

export const useAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAlerts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await alertAPI.getAlerts();
            setAlerts(response);
        } catch (err) {
            setError(err.message || 'Failed to fetch alerts');
        } finally {
            setLoading(false);
        }
    }, []);

    const createAlert = useCallback(async (alertData) => {
        try {
            const response = await alertAPI.createAlert(alertData);
            setAlerts(prev => [response, ...prev]);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to create alert');
            throw err;
        }
    }, []);

    const updateAlert = useCallback(async (id, alertData) => {
        try {
            const response = await alertAPI.updateAlert(id, alertData);
            setAlerts(prev => prev.map(alert => alert.id === id ? response : alert));
            return response;
        } catch (err) {
            setError(err.message || 'Failed to update alert');
            throw err;
        }
    }, []);

    const deleteAlert = useCallback(async (id) => {
        try {
            await alertAPI.deleteAlert(id);
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to delete alert');
            throw err;
        }
    }, []);

    useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

    return { alerts, loading, error, createAlert, updateAlert, deleteAlert, refresh: fetchAlerts };
};
