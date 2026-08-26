import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import ErrorBoundary from './components/Common/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/prediction" element={<PredictionPage />} />

                        </Routes>
                    </main>
                    <Footer />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                        }}
                    />
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
