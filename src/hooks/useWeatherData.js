import { useState, useEffect, useCallback } from 'react';
import weatherService from '../services/weatherService';

export const useWeatherData = (location, autoRefresh = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await weatherService.getCurrentWeather(location);
            setData(result);
        } catch (err) {
            setError(err.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    }, [location]);

    useEffect(() => {
        fetchData();
        let interval;
        if (autoRefresh) {
            interval = setInterval(fetchData, 300000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [fetchData, autoRefresh]);

    const refresh = useCallback(() => { fetchData(); }, [fetchData]);

    return { data, loading, error, refresh };
};
