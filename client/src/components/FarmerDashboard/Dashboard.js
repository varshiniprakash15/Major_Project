
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, ArrowLeft, Sun, CloudRain, Wind, Thermometer, BarChart2, Calendar, HelpCircle, LogOut, Tractor, Search, Crop } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import GoogleMap from './GoogleMap';
import { translations, cropOptions } from '../utils/cropData';
// import { motion } from 'framer-motion';
// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyArhd05y22cQYGTyOt9ke3KVyD89y5_o_s';

// const AGAPI = "579b464db66ec23bdd00000124700368fe0249cf59d50bb067c1530c";
const API_BASE_URL = "http://localhost:6002/api";
const About = () => (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">About Farm Unity</h2>
        <p className="text-gray-600">
            Farm Unity is a revolutionary platform designed to empower farmers with modern tools and insights.
            Our mission is to enhance agricultural productivity and sustainability through technology.
        </p>
        <p className="text-gray-600 mt-4">
            This is a placeholder for more detailed information about Farm Unity. You can add your specific content here.
        </p>
    </div>
);

const CropPriceComponent = () => {
    const [language, setLanguage] = useState('english');
    const [searchTerm, setSearchTerm] = useState('');

    const cropData = useMemo(() => {
        return cropOptions
            .filter(option => option.price !== "0")
            .map((option, index) => ({
                id: index + 1,
                name: option.name,
                priceInRupees: parseInt(option.price),
                imageUrl: option.imageURL || '', // Include image URL
                translations: translations[option.name] || {
                    kannada: option.name,
                    hindi: option.name
                }
            }));
    }, []);

    const filteredCrops = useMemo(() => {
        return cropData.filter(crop => {
            const searchName = searchTerm.toLowerCase();

            const nameToSearch = language === 'kannada'
                ? (crop.translations.kannada || crop.name).toLowerCase()
                : language === 'hindi'
                    ? (crop.translations.hindi || crop.name).toLowerCase()
                    : crop.name.toLowerCase();

            return nameToSearch.includes(searchName);
        });
    }, [cropData, searchTerm, language]);

    const renderCropName = (crop) => {
        switch (language) {
            case 'kannada':
                return crop.translations.kannada || crop.name;
            case 'hindi':
                return crop.translations.hindi || crop.name;
            default:
                return crop.name;
        }
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center">ಕೃಷಿ ಉತ್ಪನ್ನಗಳ ಬೆಲೆ (Crop Prices)</h1>

                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                    <div className="flex items-center">
                        <label className="mr-2">Language:</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="english">English</option>
                            <option value="kannada">ಕನ್ನಡ</option>
                            <option value="hindi">हिन्दी</option>
                        </select>
                    </div>

                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search crops..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {filteredCrops.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        No crops found matching your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCrops.map((crop) => (
                            <div
                                key={crop.id}
                                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        {crop.imageUrl && (
                                            <img
                                                src={crop.imageUrl}
                                                alt={crop.name}
                                                className="w-8 h-8 object-cover rounded-full"
                                            />
                                        )}
                                        <h2 className="text-xl font-semibold">
                                            {renderCropName(crop)}
                                        </h2>
                                    </div>
                                    <span className="text-green-600 font-bold">
                                        ₹{crop.priceInRupees}/ql
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
// Removed mock data generation - now fetching from database

const Dashboard = ({ onBackClick }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [services, setServices] = useState([]);
    const [weatherData, setWeatherData] = useState({
        temperature: 0,
        humidity: 0,
        windSpeed: 0,
        rainfall: 0
    });
    const [showMarketPrices, setShowMarketPrices] = useState(false);
    const [cropPrices, setCropPrices] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ date: '', workers: 0, notes: '' });

    const [laborers, setLaborers] = useState([]);
    const [laborersError, setLaborersError] = useState(null);
    const [isLoadingLaborers, setIsLoadingLaborers] = useState(false);

    const [currentLocation, setCurrentLocation] = useState({
        lat: 13.375231686978495,
        lng: 77.09425047512978
    });

    const [locationError, setLocationError] = useState(null);
    const [watchId] = useState(null);
    const [isLocationLoading, setIsLocationLoading] = useState(true);


    const [locationName, setLocationName] = useState('');

    const getLocationName = async (lat, lng) => {
        const apiKey = 'AIzaSyArhd05y22cQYGTyOt9ke3KVyD89y5_o_s';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            console.log(data); // Log the full response for debugging

            if (data.status === "OK" && data.results.length > 0) {
                const address = data.results[0].formatted_address;
                return address;
            } else {
                console.error("Geocoding API error:", data.status);
                return "Location not found";
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            return "Location not found";
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setCurrentLocation({ lat, lng });
                    setIsLocationLoading(false);

                    // Get location name using the internal function
                    const address = await getLocationName(lat, lng);
                    setLocationName(address);
                },
                (error) => {
                    setLocationError(`Error getting location: ${error.message}`);
                    setIsLocationLoading(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocationError('Geolocation is not supported by your browser.');
            setIsLocationLoading(false);
        }
    }, []);

    const renderLocation = () => {
        if (locationError) {
            return (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Real-time Location</h2>
                    <div className="text-red-500 mb-4">
                        {locationError === 'User denied geolocation permission' ? (
                            <>
                                <p>Error getting location: Permission was denied.</p>
                                <p className="text-gray-600 mt-2">
                                    To allow location access, please enable it in your browser settings.
                                </p>
                                <button
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                    onClick={() => {
                                        setIsLocationLoading(true);
                                        navigator.geolocation.getCurrentPosition(
                                            async (position) => {
                                                const { latitude: lat, longitude: lng } = position.coords;
                                                setCurrentLocation({ lat, lng });
                                                const address = await getLocationName(lat, lng);
                                                setLocationName(address);
                                                setLocationError(null);
                                                setIsLocationLoading(false);
                                            },
                                            (error) => {
                                                setLocationError(`Error getting location: ${error.message}`);
                                                setIsLocationLoading(false);
                                            },
                                            { enableHighAccuracy: true }
                                        );
                                    }}
                                >
                                    Retry Location Access
                                </button>
                            </>
                        ) : (
                            <p>Error getting location: {locationError}</p>
                        )}
                    </div>
                </div>
            );
        }
        return (
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Real-time Location</h2>
                {isLocationLoading ? (
                    <div className="text-gray-600">Loading location...</div>
                ) : (
                    <>
                        <div className="mb-4 text-gray-600">
                            <p>Current Location: {locationName || "Fetching address..."}</p>
                            <p>Latitude: {currentLocation?.lat.toFixed(6)}</p>
                            <p>Longitude: {currentLocation?.lng.toFixed(6)}</p>
                        </div>
                        {GOOGLE_MAPS_API_KEY && (
                            <GoogleMap
                                apiKey={GOOGLE_MAPS_API_KEY}
                                center={currentLocation}
                            />
                        )}
                    </>
                )}
            </div>
        );
    };

    const toggleMenu = () => setShowMenu(!showMenu);

    //get request to load available services
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:6002/api/services');
            console.log('Fetched services:', response.data);
            setServices(response.data.services || response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchLaborers = async () => {
        setIsLoadingLaborers(true);
        setLaborersError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/labourers`);
            if (response.data && Array.isArray(response.data)) {
                setLaborers(response.data);
            } else {
                throw new Error('Invalid laborer data format');
            }
        } catch (error) {
            console.error('Error fetching laborers:', error);
            setLaborersError(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch laborers. Please try again later.'
            );
            setLaborers([]); // Clear any previous data
        } finally {
            setIsLoadingLaborers(false);
        }
    };

    useEffect(() => {
        if (currentPage === 'labor') {
            fetchLaborers();
        }
    }, [currentPage]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Tumkur&units=metric&appid=4fcc4389268b7e95e62f16724eceebf7');
                const data = await response.json();
                setWeatherData({
                    temperature: data.main.temp,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    rainfall: data.rain ? data.rain['1h'] : 0
                });
            } catch (error) {
                console.error("Failed to fetch weather data:", error);
                setError("Failed to fetch weather data. Please try again later.");
            }
        };

        fetchWeatherData();
        const intervalId = setInterval(fetchWeatherData, 3600000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (showMarketPrices) {
            fetchCropPrices();
        }
    }, [showMarketPrices]);

    const fetchCropPrices = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:6002/api/crop-prices');
            if (response.ok) {
                const data = await response.json();
                setCropPrices(data.cropPrices || []);
            } else {
                throw new Error('Failed to fetch crop prices');
            }
        } catch (error) {
            console.error("Failed to fetch crop prices:", error);
            setError("Failed to fetch crop prices. Please try again later.");
            setCropPrices([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarketPricesClick = () => {
        setShowMarketPrices(true);
        setCurrentPage('marketPrices');
    };

    const handleLaborClick = () => {
        setCurrentPage('labor');
    };

    const handleServiceProvidersClick = () => {
        setCurrentPage('serviceProviders');
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        setCalendarEvents([...calendarEvents, { ...newEvent, id: Date.now() }]);
        setNewEvent({ date: '', workers: 0, notes: '' });
    };

    const handleDeleteEvent = (id) => {
        setCalendarEvents(calendarEvents.filter(event => event.id !== id));
    };

    const menuItems = [
        { icon: <BarChart2 className="w-5 h-5 mr-3" />, text: "Live status Dashboard", page: 'dashboard' },
        { icon: <Crop className="w-5 h-5 mr-3" />, text: "My Services" },
        { icon: <Calendar className="w-5 h-5 mr-3" />, text: "My Calendar", page: 'calendar' },
        { icon: <Crop className="w-5 h-5 mr-3" />, text: "Crop Data", page: 'cropData' },
        { icon: <HelpCircle className="w-5 h-5 mr-3" />, text: "Help & Support" },
        { icon: <LogOut className="w-5 h-5 mr-3" />, text: "Logout" },
        { icon: <Tractor className="w-5 h-5 mr-3" />, text: "About", page: 'about' }
    ];
    const renderWeatherOverview = () => (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Weather Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center bg-yellow-100 p-4 rounded-lg">
                    <Sun className="w-10 h-10 text-yellow-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-2xl font-semibold text-gray-800">{weatherData.temperature.toFixed(1)}°C</p>
                    </div>
                </div>
                <div className="flex items-center bg-blue-100 p-4 rounded-lg">
                    <CloudRain className="w-10 h-10 text-blue-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-600">Rainfall</p>
                        <p className="text-2xl font-semibold text-gray-800">{weatherData.rainfall.toFixed(1)} mm</p>
                    </div>
                </div>
                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                    <Wind className="w-10 h-10 text-gray-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-600">Wind Speed</p>
                        <p className="text-2xl font-semibold text-gray-800">{weatherData.windSpeed.toFixed(1)} m/s</p>
                    </div>
                </div>
                <div className="flex items-center bg-red-100 p-4 rounded-lg">
                    <Thermometer className="w-10 h-10 text-red-500 mr-4" />
                    <div>
                        <p className="text-sm text-gray-600">Humidity</p>
                        <p className="text-2xl font-semibold text-gray-800">{weatherData.humidity.toFixed(0)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );


    const renderMarketPrices = () => (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Market Prices</h2>
            {isLoading ? (
                <p>Loading crop prices...</p>
            ) : error ? (
                <>
                    <p className="text-red-500 mb-2">{error}</p>
                    <button
                        onClick={fetchCropPrices}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Retry
                    </button>
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Crop List</h3>
                        {cropPrices.length > 0 ? (
                            <ul className="space-y-2">
                                {cropPrices.map((crop) => (
                                    <li
                                        key={crop.id}
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                        onClick={() => setSelectedCrop(crop)}
                                    >
                                        {crop.name} - ₹{crop.price}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No crop prices available at the moment.</p>
                        )}
                    </div>
                    <div>
                        {selectedCrop && (
                            <>
                                <h3 className="text-lg font-semibold mb-2">{selectedCrop.name} Price Trend</h3>
                                {selectedCrop.priceHistory && selectedCrop.priceHistory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={selectedCrop.priceHistory.reverse()}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="price" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p>No price history available for this crop.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderLaborers = () => (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Available Laborers</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Skills</th>
                            <th className="py-2 px-4 border-b text-left">Dailywage</th>
                            <th className="py-2 px-4 border-b text-left">Contact</th>
                            <th className="py-2 px-4 border-b text-left">Available On</th>

                        </tr>
                    </thead>
                    <tbody>
                        {laborers.map((laborer) => (
                            <tr key={laborer.id}>
                                <td className="py-2 px-4 border-b">{laborer.name}</td>
                                <td className="py-2 px-4 border-b">
    {typeof laborer.skills === 'string'
        ? laborer.skills
        : Array.isArray(laborer.skills?.primarySkills)
            ? laborer.skills.primarySkills.toString()
            : Array.isArray(laborer.skills)
                ? laborer.skills.toString()
                : 'Agricultural Skills'}
</td>

                                <td className="py-2 px-4 border-b">₹{laborer.workDetails?.dailyWage || laborer.amount || 500}</td>
                                <td className="py-2 px-4 border-b">{laborer.mobileNumber}</td>
                                <td className="py-2 px-4 border-b">{laborer.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    const renderCalendar = () => (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">My Calendar</h2>
            <form onSubmit={handleAddEvent} className="mb-4">
                <div className="flex flex-wrap -mx-2 mb-4">
                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="date">
                            Date
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="date"
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="workers">
                            Number of Workers
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="workers"
                            type="number"
                            min="0"
                            value={newEvent.workers}
                            onChange={(e) => setNewEvent({ ...newEvent, workers: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="w-full md:w-1/3 px-2">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="notes">
                            Notes
                        </label>
                        <input
                            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            id="notes"
                            type="text"
                            value={newEvent.notes}
                            onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        POST JOB REQUEST
                    </button>
                </div>
            </form>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Date</th>
                            <th className="py-2 px-4 border-b text-left">Workers Needed</th>
                            <th className="py-2 px-4 border-b text-left">Notes</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calendarEvents.map((event) => (
                            <tr key={event.id}>
                                <td className="py-2 px-4 border-b">{event.date}</td>
                                <td className="py-2 px-4 border-b">{event.workers}</td>
                                <td className="py-2 px-4 border-b">{event.notes}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderServiceProviders = () => (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Service Providers</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Service Name</th>
                            <th className="py-2 px-4 border-b text-left">Amount</th>
                            <th className="py-2 px-4 border-b text-left">Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td className="py-2 px-4 border-b">{service.name}</td>
                                <td className="py-2 px-4 border-b">₹{service.amount}</td>
                                <td className="py-2 px-4 border-b">{service.mobileNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Sidebar */}
            <div className={`w-64 bg-gradient-to-b from-green-700 to-green-900 text-white shadow-lg transition-all duration-300 ease-in-out ${showMenu ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <img src="/api/placeholder/40/40" alt="Profile" className="w-12 h-12 rounded-full mr-4 border-2 border-white" />
                        <div>
                            <h2 className="font-bold text-lg">John Smith</h2>
                            <p className="text-sm text-green-200">Farmer ID: F12345</p>
                        </div>
                    </div>
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center py-3 px-4 rounded-lg mb-2 transition-colors duration-200 ${currentPage === item.page ? 'bg-green-600' : 'hover:bg-green-700'} cursor-pointer`}
                            onClick={() => item.page && setCurrentPage(item.page)}
                        >
                            {item.icon}
                            <span className="ml-3">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
                        <div className="flex items-center">
                            <button onClick={toggleMenu} className="md:hidden mr-4 text-gray-600 hover:text-gray-900">
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                onClick={handleMarketPricesClick}
                            >
                                Market Prices
                            </button>
                            <button
                                onClick={onBackClick}
                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {currentPage === 'dashboard' && (
                            <>
                                {renderWeatherOverview()}
                                {renderLocation()}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
                                        onClick={handleLaborClick}
                                    >
                                        Labour
                                    </button>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
                                        onClick={handleServiceProvidersClick}
                                    >
                                        Service Provider
                                    </button>
                                </div>
                            </>
                        )}
                        {currentPage === 'about' && <About />}
                        {currentPage === 'cropData' && <CropPriceComponent />}
                        {currentPage === 'marketPrices' && renderMarketPrices()}
                        {currentPage === 'labor' && renderLaborers()}
                        {currentPage === 'serviceProviders' && renderServiceProviders()}
                        {currentPage === 'calendar' && renderCalendar()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
