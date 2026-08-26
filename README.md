# Heatwave Intelligence & Early Warning System

An AI-powered web application for heatwave detection, prediction, and early warning.

## Features

- 🌡️ **Real-time Monitoring**: Live temperature data tracking
- 🤖 **AI Predictions**: Machine learning models for heatwave forecasting
- 🔔 **Alert System**: Instant notifications for heatwave events
- 📊 **Data Analytics**: Comprehensive visualization and analysis
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js
- **State Management**: React Hooks
- **API Integration**: Axios
- **Charts**: Recharts, Chart.js
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/heatwave-intelligence-system.git
cd heatwave-intelligence-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

5. Build for production:
```bash
npm run build
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with hero and key features |
| `/dashboard` | Real-time temperature monitoring |
| `/analysis` | Historical data charts |
| `/alerts` | Alert management system |
| `/prediction` | AI heatwave prediction |
| `/about` | Mission and team |
