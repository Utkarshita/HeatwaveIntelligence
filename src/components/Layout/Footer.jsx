import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">

                            <span className="text-lg font-bold text-gray-800">Heatwave Intelligence System</span>
                        </div>
                        <p className="text-gray-600 text-sm">
                            An AI-powered early warning system for heatwave detection and prediction,
                            helping communities prepare and respond to extreme heat events.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li><a href="/dashboard" className="text-gray-600 hover:text-red-600 text-sm">Dashboard</a></li>
                            <li><a href="/alerts" className="text-gray-600 hover:text-red-600 text-sm">Alerts</a></li>
                            <li><a href="/prediction" className="text-gray-600 hover:text-red-600 text-sm">Predictions</a></li>
                        </ul>
                    </div>

                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} Heatwave Intelligence System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
