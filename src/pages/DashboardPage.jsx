import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import weatherService from '../services/weatherService';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [selectedCity, setSelectedCity] = useState('Delhi');
    const [isLiveData, setIsLiveData] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'];

    useEffect(() => {
        fetchData();
        // Refresh data every 5 minutes
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [selectedCity]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch current weather for all cities
            const allCityWeather = await weatherService.getMultipleCitiesWeather(cities);

            // Fetch forecast for selected city
            const forecast = await weatherService.getForecast(selectedCity, 7);

            // Fetch heatwave alerts
            const alerts = await weatherService.getHeatwaveAlerts(cities);

            setWeatherData({
                current: allCityWeather.find(w => w.location === selectedCity),
                allCities: allCityWeather,
                alerts: alerts,
                totalAlerts: alerts.length,
                criticalAlerts: alerts.filter(a => a.severity === 'high').length,
                warningAlerts: alerts.filter(a => a.severity === 'medium').length
            });

            setForecastData(forecast);
            setIsLiveData(!weatherService.useMockData);
            setLastUpdated(new Date().toISOString());

            const dataSource = !weatherService.useMockData ? 'Live OpenWeatherMap data' : 'Demo data';
            toast.success(`Data updated successfully! ${dataSource}`);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data
    const tempChartData = {
        labels: forecastData?.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Max Temperature (°C)',
                data: forecastData?.map(d => d.maxTemp) || [32, 35, 38, 42, 45, 40, 36],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Min Temperature (°C)',
                data: forecastData?.map(d => d.minTemp) || [25, 27, 29, 32, 34, 30, 26],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Average Temperature (°C)',
                data: forecastData?.map(d => d.temp) || [28, 31, 34, 37, 39, 35, 31],
                borderColor: 'rgb(251, 146, 60)',
                backgroundColor: 'rgba(251, 146, 60, 0.1)',
                fill: true,
                tension: 0.4,
                borderDash: [5, 5],
            }
        ]
    };

    const alertData = {
        labels: ['Critical', 'Warning', 'Info'],
        datasets: [
            {
                data: [
                    weatherData?.criticalAlerts || 0,
                    weatherData?.warningAlerts || 0,
                    (weatherData?.totalAlerts || 0) - (weatherData?.criticalAlerts || 0) - (weatherData?.warningAlerts || 0)
                ],
                backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'],
                borderWidth: 0,
            }
        ]
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const currentWeather = weatherData?.current;

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header with Live Data Indicator */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-600 flex items-center gap-2 flex-wrap">
                            Real-time heatwave monitoring and analytics
                            {isLiveData ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                    Live Data
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                                    Demo Data
                                </span>
                            )}
                            {lastUpdated && (
                                <span className="text-xs text-gray-400">
                                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                        >
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid - Using Live Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Current Temperature</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {currentWeather?.temperature || '--'}°C
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Feels like {currentWeather?.feelsLike || '--'}°C
                                </p>
                                {currentWeather?.country && (
                                    <p className="text-xs text-gray-400">{currentWeather.country}</p>
                                )}
                            </div>

                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Max Temperature</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {currentWeather?.maxTemp || '--'}°C
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Min: {currentWeather?.minTemp || '--'}°C
                                </p>
                            </div>

                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Active Alerts</p>
                                <p className="text-3xl font-bold text-orange-500">
                                    {weatherData?.totalAlerts || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Critical: {weatherData?.criticalAlerts || 0} | Warning: {weatherData?.warningAlerts || 0}
                                </p>
                            </div>

                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Humidity & Wind</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {currentWeather?.humidity || '--'}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Wind: {currentWeather?.windSpeed || '--'} km/h
                                </p>
                            </div>

                        </div>
                    </motion.div>
                </div>

                {/* Weather Description Card */}
                {currentWeather && (
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="text-6xl">
                                    {currentWeather.temperature >= 40 ? '🥵' :
                                        currentWeather.temperature >= 35 ? '😓' :
                                            currentWeather.temperature >= 30 ? '😊' : '😌'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {selectedCity} Weather
                                    </h3>
                                    <p className="text-gray-600 capitalize">
                                        {currentWeather.description}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Pressure: {currentWeather.pressure} hPa
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    Data Source: {isLiveData ? 'OpenWeatherMap API' : 'Demo Dataset'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Last updated: {new Date(currentWeather.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            7-Day Forecast for {selectedCity}
                        </h3>
                        <div className="h-64">
                            <Line data={tempChartData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return context.dataset.label + ': ' + context.parsed.y + '°C';
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: false,
                                        min: 20,
                                        title: {
                                            display: true,
                                            text: 'Temperature (°C)'
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Alert Distribution</h3>
                        <div className="h-64 flex items-center justify-center">
                            <Doughnut data={alertData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                },
                                cutout: '60%'
                            }} />
                        </div>
                    </div>
                </div>

                {/* All Cities Data */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">City-wise Temperature</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {weatherData?.allCities?.map((city, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{city.location}</p>
                                    <p className="text-sm text-gray-500">Humidity: {city.humidity}%</p>
                                    <p className="text-xs text-gray-400 capitalize">{city.description}</p>
                                </div>
                                <div className={`text-2xl font-bold ${city.temperature > 40 ? 'text-red-600' :
                                    city.temperature > 35 ? 'text-orange-500' :
                                        city.temperature > 30 ? 'text-yellow-600' :
                                            'text-blue-600'
                                    }`}>
                                    {city.temperature}°C
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Data Source Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xl"></span>
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {isLiveData ? 'Live Data from OpenWeatherMap API' : 'Demo Data Mode'}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {isLiveData
                                        ? 'Real-time weather data from OpenWeatherMap'
                                        : 'Add your OpenWeatherMap API key to enable live data'}
                                </p>
                            </div>
                        </div>
                        {isLiveData && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                API Key: (Active)
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;