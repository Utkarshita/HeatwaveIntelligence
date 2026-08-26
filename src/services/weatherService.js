import axios from 'axios';

// Weather Service with Live Dataset from OpenWeatherMap API
class WeatherService {
    constructor() {
        // YOUR API KEY FROM OpenWeatherMap
        this.apiKey = 'a876f865ef7a72580a3f8ee0b663f010';
        this.baseURL = 'https://api.openweathermap.org/data/2.5';

        // Check if API key is valid (not the placeholder)
        this.useMockData = !this.apiKey || this.apiKey === 'your_openweather_api_key_here';

        console.log(`Weather Service initialized with ${this.useMockData ? 'MOCK' : 'LIVE'} data`);
        if (!this.useMockData) {
            console.log('🌐 Using OpenWeatherMap API with key:', this.apiKey.substring(0, 8) + '...');
        }
    }

    // Fetch current weather for a location
    async getCurrentWeather(location) {
        if (this.useMockData) {
            return this.getMockCurrentWeather(location);
        }

        try {
            const response = await axios.get(`${this.baseURL}/weather`, {
                params: {
                    q: location,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            return {
                location: response.data.name,
                temperature: Math.round(response.data.main.temp),
                feelsLike: Math.round(response.data.main.feels_like),
                humidity: response.data.main.humidity,
                pressure: response.data.main.pressure,
                windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
                description: response.data.weather[0].description,
                icon: response.data.weather[0].icon,
                timestamp: new Date().toISOString(),
                minTemp: Math.round(response.data.main.temp_min),
                maxTemp: Math.round(response.data.main.temp_max),
                country: response.data.sys.country
            };
        } catch (error) {
            console.error('Error fetching weather data:', error);
            // Fallback to mock data if API fails
            return this.getMockCurrentWeather(location);
        }
    }

    // Fetch 5-day forecast
    async getForecast(location, days = 5) {
        if (this.useMockData) {
            return this.getMockForecast(location, days);
        }

        try {
            const response = await axios.get(`${this.baseURL}/forecast`, {
                params: {
                    q: location,
                    appid: this.apiKey,
                    units: 'metric',
                    cnt: Math.min(days * 8, 40) // Max 40 data points (5 days)
                }
            });

            // Process forecast data
            const forecastData = [];
            const dailyData = {};

            response.data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                if (!dailyData[date]) {
                    dailyData[date] = {
                        temps: [],
                        humidities: [],
                        descriptions: [],
                        icons: [],
                        pressures: []
                    };
                }
                dailyData[date].temps.push(item.main.temp);
                dailyData[date].humidities.push(item.main.humidity);
                dailyData[date].descriptions.push(item.weather[0].description);
                dailyData[date].icons.push(item.weather[0].icon);
                dailyData[date].pressures.push(item.main.pressure);
            });

            // Calculate daily averages
            Object.keys(dailyData).forEach(date => {
                const day = dailyData[date];
                forecastData.push({
                    date: date,
                    temp: Math.round(day.temps.reduce((a, b) => a + b) / day.temps.length),
                    maxTemp: Math.round(Math.max(...day.temps)),
                    minTemp: Math.round(Math.min(...day.temps)),
                    humidity: Math.round(day.humidities.reduce((a, b) => a + b) / day.humidities.length),
                    pressure: Math.round(day.pressures.reduce((a, b) => a + b) / day.pressures.length),
                    description: day.descriptions[Math.floor(day.descriptions.length / 2)],
                    icon: day.icons[0]
                });
            });

            return forecastData.slice(0, days);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            return this.getMockForecast(location, days);
        }
    }

    // Fetch multiple cities for dashboard
    async getMultipleCitiesWeather(cities) {
        const promises = cities.map(city => this.getCurrentWeather(city));
        const results = await Promise.allSettled(promises);

        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
    }

    // Get heatwave alerts based on temperature thresholds
    async getHeatwaveAlerts(locations) {
        const alerts = [];

        for (const location of locations) {
            try {
                const weather = await this.getCurrentWeather(location);

                // Check heatwave conditions
                if (weather.temperature >= 40) {
                    alerts.push({
                        id: Date.now() + Math.random(),
                        type: 'critical',
                        message: `🚨 EXTREME HEATWAVE: Temperature reached ${weather.temperature}°C in ${location}`,
                        location: location,
                        severity: 'high',
                        temperature: weather.temperature,
                        timestamp: new Date().toISOString(),
                        status: 'active',
                        recommendations: 'Stay indoors, keep hydrated, avoid outdoor activities'
                    });
                } else if (weather.temperature >= 35) {
                    alerts.push({
                        id: Date.now() + Math.random(),
                        type: 'warning',
                        message: `⚠️ HIGH TEMPERATURE ALERT: ${weather.temperature}°C in ${location}`,
                        location: location,
                        severity: 'medium',
                        temperature: weather.temperature,
                        timestamp: new Date().toISOString(),
                        status: 'active',
                        recommendations: 'Limit outdoor exposure, stay in shaded areas'
                    });
                } else if (weather.temperature >= 30) {
                    alerts.push({
                        id: Date.now() + Math.random(),
                        type: 'info',
                        message: `ℹ️ Warm weather advisory for ${location} at ${weather.temperature}°C`,
                        location: location,
                        severity: 'low',
                        temperature: weather.temperature,
                        timestamp: new Date().toISOString(),
                        status: 'active',
                        recommendations: 'Stay hydrated and use sun protection'
                    });
                }
            } catch (error) {
                console.error(`Error checking alerts for ${location}:`, error);
            }
        }

        return alerts;
    }

    // Get weather by coordinates
    async getWeatherByCoords(lat, lon) {
        if (this.useMockData) {
            return this.getMockCurrentWeather('Unknown');
        }

        try {
            const response = await axios.get(`${this.baseURL}/weather`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: this.apiKey,
                    units: 'metric'
                }
            });

            return {
                location: response.data.name,
                temperature: Math.round(response.data.main.temp),
                feelsLike: Math.round(response.data.main.feels_like),
                humidity: response.data.main.humidity,
                pressure: response.data.main.pressure,
                windSpeed: Math.round(response.data.wind.speed * 3.6),
                description: response.data.weather[0].description,
                icon: response.data.weather[0].icon,
                timestamp: new Date().toISOString(),
                minTemp: Math.round(response.data.main.temp_min),
                maxTemp: Math.round(response.data.main.temp_max)
            };
        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            return this.getMockCurrentWeather('Unknown');
        }
    }

    // MOCK DATA FUNCTIONS (Fallback when no API key)
    getMockCurrentWeather(location) {
        const mockData = {
            'Delhi': { temp: 42, humidity: 45, wind: 12, description: 'Clear sky' },
            'Mumbai': { temp: 38, humidity: 70, wind: 8, description: 'Partly cloudy' },
            'Chennai': { temp: 40, humidity: 75, wind: 10, description: 'Hazy' },
            'Kolkata': { temp: 42, humidity: 68, wind: 7, description: 'Clear sky' },
            'Bangalore': { temp: 35, humidity: 60, wind: 15, description: 'Pleasant' },
            'Hyderabad': { temp: 41, humidity: 55, wind: 11, description: 'Sunny' },
            'Pune': { temp: 37, humidity: 58, wind: 9, description: 'Clear sky' },
            'Ahmedabad': { temp: 43, humidity: 40, wind: 13, description: 'Hot and dry' }
        };

        const data = mockData[location] || { temp: 38, humidity: 60, wind: 10, description: 'Clear' };

        return {
            location: location,
            temperature: data.temp,
            feelsLike: data.temp + 2,
            humidity: data.humidity,
            pressure: 1010 + Math.floor(Math.random() * 20),
            windSpeed: data.wind,
            description: data.description,
            icon: '01d',
            timestamp: new Date().toISOString(),
            minTemp: data.temp - 3,
            maxTemp: data.temp + 2,
            country: 'IN'
        };
    }

    getMockForecast(location, days) {
        const baseTemp = this.getMockCurrentWeather(location).temperature || 38;
        const forecast = [];

        for (let i = 0; i < days; i++) {
            const temp = baseTemp - 2 + Math.random() * 5;
            forecast.push({
                date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
                temp: Math.round(temp),
                maxTemp: Math.round(temp + 2),
                minTemp: Math.round(temp - 4),
                humidity: Math.round(45 + Math.random() * 30),
                pressure: 1010 + Math.floor(Math.random() * 15),
                description: ['Clear', 'Partly Cloudy', 'Cloudy', 'Sunny', 'Hot'][Math.floor(Math.random() * 5)],
                icon: '01d'
            });
        }

        return forecast;
    }
}

// Export a singleton instance
export default new WeatherService();