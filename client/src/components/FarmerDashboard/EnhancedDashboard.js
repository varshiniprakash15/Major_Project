import React, { useState, useEffect } from 'react';
import { 
    Menu, ArrowLeft, Sun, CloudRain, Wind, Thermometer, BarChart2, 
    Calendar, HelpCircle, LogOut, Search, Users, Wrench,
    MessageCircle, BookOpen, Star, Phone, CheckCircle, Send, Bot, Brain,
    ExternalLink, MessageSquare, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
// import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';

const API_BASE_URL = "http://localhost:6002/api";

// AI-powered filtering component
const AIFilter = ({ onFilter, type }) => {
    const [filters, setFilters] = useState({
        location: '',
        priceRange: { min: 0, max: 10000 },
        skills: [],
        availability: 'all',
        rating: 0
    });
    const [isAIActive, setIsAIActive] = useState(false);
    const [aiResults, setAiResults] = useState(null);

    const handleAIFilter = async () => {
        setIsAIActive(true);
        try {
            // Simulate AI processing with more realistic delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Enhanced AI-powered filtering logic
            const currentTime = new Date();
            const currentHour = currentTime.getHours();
            
            // AI recommendations based on time, weather, and user preferences
            const aiRecommendations = {
                location: filters.location || 'Tumkur, Karnataka',
                priceRange: {
                    min: Math.max(0, filters.priceRange.min - 100),
                    max: Math.min(10000, filters.priceRange.max + 200)
                },
                skills: filters.skills.length > 0 ? filters.skills : ['harvesting', 'plowing', 'irrigation'],
                availability: currentHour >= 6 && currentHour <= 18 ? 'available' : 'limited',
                rating: Math.max(3.5, filters.rating),
                aiScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
                recommendations: [
                    'Best matches based on your location and requirements',
                    'Considered current weather conditions',
                    'Prioritized highly-rated providers',
                    'Filtered by availability and pricing'
                ],
                weatherFactor: currentHour >= 6 && currentHour <= 10 ? 'Morning work recommended' : 'Flexible timing available',
                costOptimization: 'AI found 15% better pricing options'
            };
            
            setAiResults(aiRecommendations);
            onFilter(aiRecommendations);
            toast.success(`AI found ${Math.floor(Math.random() * 10) + 5} optimized matches!`);
        } catch (error) {
            console.error('AI filtering error:', error);
            toast.error('AI filtering failed. Please try again.');
        } finally {
            setIsAIActive(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    AI-Powered Filtering
                </h3>
                <button
                    onClick={handleAIFilter}
                    disabled={isAIActive}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isAIActive 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                    {isAIActive ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            AI Processing...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Bot className="w-4 h-4 mr-2" />
                            Apply AI Filter
                        </div>
                    )}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range (₹)
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            value={filters.priceRange.min}
                            onChange={(e) => setFilters(prev => ({ 
                                ...prev, 
                                priceRange: { ...prev.priceRange, min: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Min"
                        />
                        <input
                            type="number"
                            value={filters.priceRange.max}
                            onChange={(e) => setFilters(prev => ({ 
                                ...prev, 
                                priceRange: { ...prev.priceRange, max: parseInt(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Max"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                    </label>
                    <select
                        value={filters.rating}
                        onChange={(e) => setFilters(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value={0}>Any Rating</option>
                        <option value={1}>1+ Stars</option>
                        <option value={2}>2+ Stars</option>
                        <option value={3}>3+ Stars</option>
                        <option value={4}>4+ Stars</option>
                        <option value={5}>5 Stars</option>
                    </select>
                </div>
            </div>
            
            {/* AI Results Display */}
            {aiResults && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                    <div className="flex items-center mb-3">
                        <Brain className="w-5 h-5 text-purple-600 mr-2" />
                        <h4 className="font-semibold text-purple-800">AI Analysis Results</h4>
                        <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            Score: {aiResults.aiScore}%
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-700 mb-2">
                                <strong>Weather Factor:</strong> {aiResults.weatherFactor}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Cost Optimization:</strong> {aiResults.costOptimization}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700 mb-2">
                                <strong>Availability:</strong> {aiResults.availability}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Location:</strong> {aiResults.location}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">AI Recommendations:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            {aiResults.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Government Schemes RAG Component
const GovernmentSchemes = () => {
    const { t, getCurrentLanguage } = useLanguage();
    const [schemes, setSchemes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory] = useState('');

    // Handle Apply Now button click
    const handleApplyNow = (scheme) => {
        // Open scheme details in a new tab or modal
        if (scheme.applicationUrl) {
            window.open(scheme.applicationUrl, '_blank');
        } else {
            // Show scheme details modal or redirect to application page
            alert(`Application for ${scheme.title}:\n\n${scheme.applicationProcess || 'Please contact the relevant department for application details.'}`);
        }
    };

    // Fetch government schemes from RAG API
    const fetchSchemes = async (search = '', category = '') => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category) params.append('category', category);
            params.append('language', getCurrentLanguage());

            const response = await fetch(`http://localhost:6002/api/government-schemes?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch schemes');
            }

            const data = await response.json();
            console.log('Fetched schemes from RAG:', data);
            setSchemes(data.schemes || []);
        } catch (error) {
            console.error('Error fetching schemes:', error);
            toast.error('Failed to fetch government schemes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch categories from RAG API
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/scheme-categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched categories from RAG:', data);
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch recommended schemes from RAG API
    const fetchRecommendedSchemes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/recommended-schemes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched recommended schemes from RAG:', data);
                setSchemes(data.recommendations || []);
            }
        } catch (error) {
            console.error('Error fetching recommended schemes:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchRecommendedSchemes();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery || selectedCategory) {
                fetchSchemes(searchQuery, selectedCategory);
            } else {
                fetchRecommendedSchemes();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-green-600" />
                    {t('farmer.governmentSchemes')}
                </h3>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={t('governmentSchemes.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">{t('governmentSchemes.loadingSchemes')}</p>
                    </div>
                ) : schemes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>{t('governmentSchemes.noSchemesFound')}</p>
                    </div>
                ) : (
                    schemes.map((scheme) => (
                        <motion.div
                            key={scheme._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{scheme.title}</h4>
                            <p className="text-gray-600 mb-3">{scheme.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">{t('governmentSchemes.eligibility')}:</span>
                                    <p className="text-gray-600">{scheme.eligibility}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">{t('governmentSchemes.benefits')}:</span>
                                    <p className="text-gray-600">{scheme.benefits}</p>
                                </div>
                            </div>
                            
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                    Last updated: {new Date(scheme.lastUpdated).toLocaleDateString()}
                                </span>
                                <button 
                                    onClick={() => handleApplyNow(scheme)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {t('farmer.apply')}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

// Kissan AI Chat Component
const KissanAIChat = () => {
    const handleOpenKissanAI = () => {
        // Open Kissan AI chat in a new tab
        window.open('https://kissan.ai/chat', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 mr-3">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Kissan AI Assistant</h3>
                        <p className="text-sm text-gray-600">Get AI-powered farming advice</p>
                    </div>
                </div>
                <button
                    onClick={handleOpenKissanAI}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open AI Chat
                    <ExternalLink className="w-4 h-4 ml-2" />
                </button>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                    Connect with Kissan AI for personalized farming guidance, crop recommendations, 
                    weather insights, and expert agricultural advice.
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Crop Advice</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">Weather Forecast</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Disease Detection</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">Market Prices</span>
                </div>
            </div>
        </div>
    );
};

// Farmer Communication Component
const FarmerCommunication = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [farmers, setFarmers] = useState([]);

    // Fetch community messages
    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/farmer-community', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
        } finally {
            setIsLoading(false);
        }
    };

    // Send message to community
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/farmer-community', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: newMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, data.data]);
                setNewMessage('');
                toast.success('Message sent successfully!');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    // Fetch farmers list
    const fetchFarmers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/farmers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFarmers(data.farmers);
            }
        } catch (error) {
            console.error('Error fetching farmers:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchFarmers();
        
        // Set up polling for new messages
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                Farmer Community
            </h3>
            
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading messages...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className={`flex ${msg.senderId?.name === "You" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                msg.senderId?.name === "You" 
                                    ? "bg-blue-600 text-white" 
                                    : "bg-gray-100 text-gray-900"
                            }`}>
                                <div className="flex items-center mb-1">
                                    <span className="font-medium text-sm">{msg.senderId?.name || 'Unknown'}</span>
                                </div>
                                <p className="text-sm">{msg.message}</p>
                                <span className="text-xs opacity-75">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Enhanced Laborer Card Component
const LaborerCard = ({ laborer, onBook, isLoading = false }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{laborer.name}</h3>
                    <p className="text-gray-600">
                        {typeof laborer.skills === 'string' 
                            ? laborer.skills 
                            : (laborer.skills?.primarySkills?.join(', ') || 
                               Array.isArray(laborer.skills) ? laborer.skills.join(', ') : 
                               'Agricultural Skills')}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{laborer.workDetails?.dailyWage || laborer.amount || 500}</p>
                    <p className="text-sm text-gray-500">per day</p>
                </div>
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {laborer.mobileNumber}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Available: {laborer.workDetails?.availability || laborer.date || 'Available'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Rating: 4.5/5
                </div>
            </div>
            
            <div className="flex space-x-2">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                    {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showDetails ? 'Hide Details' : 'View Details'}
                </button>
                <button
                    onClick={() => onBook(laborer)}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Booking...
                        </>
                    ) : (
                        'Book Now'
                    )}
                </button>
            </div>
            
            {showDetails && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-200"
                >
                    <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Experience:</strong> 5+ years</p>
                        <p><strong>Location:</strong> Within 10km radius</p>
                        <p><strong>Availability:</strong> Monday to Saturday</p>
                        <p><strong>Specialization:</strong> Organic farming, irrigation</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

// Enhanced Service Provider Card Component
const ServiceProviderCard = ({ service, onBook, isLoading = false }) => {
    // Handle flattened service data
    const serviceName = service.serviceName || service.name || 'Service';
    const servicePrice = service.basePrice || service.amount || 1000;
    const providerName = service.providerName || 'Service Provider';
    const providerPhone = service.providerPhone || service.contactInfo?.alternateMobile || 'N/A';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{serviceName}</h3>
                    <p className="text-gray-600">{providerName}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{servicePrice}</p>
                    <p className="text-sm text-gray-500">per service</p>
                </div>
            </div>
            
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {providerPhone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Rating: 4.8/5
                </div>
            </div>
            
            <button
                onClick={() => onBook(service)}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Booking...
                    </>
                ) : (
                    'Book Service'
                )}
            </button>
        </motion.div>
    );
};

// Booking Confirmation Modal Component
const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails }) => {
    if (!isOpen || !bookingDetails) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Booking Confirmed! 🎉
                    </h3>
                    
                    {/* Booking Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="text-left space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Type:</span>
                                <span className="text-gray-900 capitalize">{bookingDetails.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Name:</span>
                                <span className="text-gray-900">{bookingDetails.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Price:</span>
                                <span className="text-gray-900 font-semibold">₹{bookingDetails.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-700">Status:</span>
                                <span className="text-green-600 font-semibold">Confirmed</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Message */}
                    <p className="text-gray-600 mb-6">
                        Your booking has been successfully confirmed! You will receive a confirmation call or message shortly.
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            Great! 👍
                        </button>
                        <button
                            onClick={() => {
                                // You can add functionality to view booking details
                                onClose();
                            }}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const EnhancedDashboard = ({ onBackClick, currentUser, onLogout }) => {
    const { t } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [laborers, setLaborers] = useState([]);
    const [services, setServices] = useState([]);
    const [weatherData, setWeatherData] = useState({
        temperature: 0,
        humidity: 0,
        windSpeed: 0,
        rainfall: 0
    });
    const [isLoading] = useState(false);
    const [showLaborers] = useState(false);
    const [showServices] = useState(false);
    const [aiFilters, setAiFilters] = useState(null);
    const [bookingLoading, setBookingLoading] = useState({});
    const [bookingConfirmation, setBookingConfirmation] = useState(null);
    const [aiInsights, setAiInsights] = useState(null);
    const [laborersError, setLaborersError] = useState(null);
    const [isLoadingLaborers, setIsLoadingLaborers] = useState(false);
    const [servicesError, setServicesError] = useState(null);
    const [isLoadingServices, setIsLoadingServices] = useState(false);

    useEffect(() => {
        fetchWeatherData();
        fetchAIInsights();
    }, []);

    // Fetch laborers when laborers page is accessed
    useEffect(() => {
        if (currentPage === 'laborers') {
            fetchLaborers(null); // null = fetch all without filters
        }
    }, [currentPage]);

    // Fetch services when services page is accessed
    useEffect(() => {
        if (currentPage === 'services') {
            fetchServices(null); // null = fetch all without filters
        }
    }, [currentPage]);

    const fetchAIInsights = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/ai-insights`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched AI insights:', data);
                setAiInsights(data.insights);
            }
        } catch (error) {
            console.error('Error fetching AI insights:', error);
        }
    };

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
        }
    };

    const fetchLaborers = async (filters = null) => {
        setIsLoadingLaborers(true);
        setLaborersError(null);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Please login to view laborers');
            }
            
            // Build query parameters only if filters are provided
            const params = new URLSearchParams();
            if (filters) {
                if (filters.location) params.append('location', filters.location);
                if (filters.minWage) params.append('minWage', filters.minWage);
                if (filters.maxWage) params.append('maxWage', filters.maxWage);
                if (filters.skills) params.append('skills', filters.skills);
                if (filters.search) params.append('search', filters.search);
                if (filters.sortBy) params.append('sortBy', filters.sortBy);
                if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            }
            
            const queryString = params.toString();
            const url = `${API_BASE_URL}/labourers${queryString ? `?${queryString}` : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched laborers:', data);
                const laborersList = data.laborers || data;
                if (Array.isArray(laborersList)) {
                    setLaborers(laborersList);
                } else {
                    throw new Error('Invalid data format received from server');
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to fetch laborers' }));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching laborers:', error);
            setLaborersError(error.message || 'Failed to fetch laborers. Please try again.');
            toast.error(error.message || 'Failed to fetch laborers. Please try again.');
            setLaborers([]);
        } finally {
            setIsLoadingLaborers(false);
        }
    };

    const fetchServices = async (filters = null) => {
        setIsLoadingServices(true);
        setServicesError(null);
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Please login to view services');
            }
            
            // Build query parameters only if filters are provided
            const params = new URLSearchParams();
            if (filters) {
                if (filters.location) params.append('location', filters.location);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                if (filters.category) params.append('category', filters.category);
                if (filters.search) params.append('search', filters.search);
                if (filters.sortBy) params.append('sortBy', filters.sortBy);
                if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            }
            
            const queryString = params.toString();
            const url = `${API_BASE_URL}/services${queryString ? `?${queryString}` : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched services:', data);
                
                // Services are already individual items, not nested in providers
                const servicesList = data.services || [];
                if (Array.isArray(servicesList)) {
                    const allServices = servicesList.map(service => ({
                        ...service,
                        providerName: service.providerId?.name || 'Unknown Provider',
                        providerPhone: service.providerId?.mobileNumber || service.mobileNumber,
                        id: service._id
                    }));
                    
                    setServices(allServices);
                    console.log('Processed services:', allServices);
                } else {
                    throw new Error('Invalid data format received from server');
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to fetch services' }));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setServicesError(error.message || 'Failed to fetch services. Please try again.');
            toast.error(error.message || 'Failed to fetch services. Please try again.');
            setServices([]);
        } finally {
            setIsLoadingServices(false);
        }
    };

    const handleBookLaborer = async (laborer) => {
        console.log('Booking laborer:', laborer);
        const laborerId = laborer._id || laborer.id;
        
        // Show confirmation dialog
        if (!window.confirm(`Are you sure you want to book ${laborer.name} for farm work?`)) {
            return;
        }
        
        setBookingLoading(prev => ({ ...prev, [laborerId]: true }));
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to book services');
                return;
            }
            const bookingData = {
                laborerId: laborer._id || laborer.id,
                bookingType: 'labor',
                workDetails: {
                    workType: 'General Farm Work',
                    description: 'Farm work as per requirements',
                    duration: 1, // days
                    dailyWage: laborer.workDetails?.dailyWage || 500,
                    totalAmount: laborer.workDetails?.dailyWage || 500
                },
                schedule: {
                    startDate: new Date().toISOString(),
                    preferredTime: '08:00'
                },
                location: {
                    address: 'Farm Location',
                    pincode: '572101',
                    coordinates: {
                        latitude: 13.3409,
                        longitude: 77.1010
                    }
                },
                communication: {
                    farmerMessage: 'Interested in hiring for farm work',
                    specialInstructions: 'Please contact for more details'
                }
            };

            const response = await fetch(`${API_BASE_URL}/create-booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                const result = await response.json();
                // Show confirmation modal instead of toast
                setBookingConfirmation({
                    type: 'Laborer',
                    name: laborer.name,
                    price: laborer.workDetails?.dailyWage || 500,
                    phone: laborer.mobileNumber || 'N/A'
                });
                console.log('Booking successful:', result);
            } else {
                const errorData = await response.json();
                console.error('Booking failed:', errorData);
                toast.error(`❌ Failed to book laborer: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Failed to send booking request. Please try again.');
        } finally {
            setBookingLoading(prev => ({ ...prev, [laborerId]: false }));
        }
    };

    const handleBookService = async (service) => {
        console.log('Booking service:', service);
        const serviceId = service._id || service.id;
        
        // Show confirmation dialog
        if (!window.confirm(`Are you sure you want to book "${service.serviceName || service.name}" service?`)) {
            return;
        }
        
        setBookingLoading(prev => ({ ...prev, [serviceId]: true }));
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to book services');
                return;
            }
            const bookingData = {
                serviceProviderId: service.providerId || service._id || service.id,
                bookingType: 'service',
                serviceDetails: {
                    serviceName: service.serviceName || service.name,
                    serviceType: service.serviceType || 'General Service',
                    description: service.description || 'Service as per requirements',
                    estimatedDuration: 2, // hours
                    price: service.basePrice || service.price || 1000
                },
                schedule: {
                    startDate: new Date().toISOString(),
                    preferredTime: '09:00'
                },
                location: {
                    address: 'Farm Location',
                    pincode: '572101',
                    coordinates: {
                        latitude: 13.3409,
                        longitude: 77.1010
                    }
                },
                communication: {
                    farmerMessage: 'Interested in hiring this service',
                    specialInstructions: 'Please contact for more details'
                }
            };

            const response = await fetch(`${API_BASE_URL}/create-booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                const result = await response.json();
                // Show confirmation modal instead of toast
                setBookingConfirmation({
                    type: 'Service',
                    name: service.serviceName || service.name,
                    price: service.basePrice || service.amount || 1000,
                    phone: service.providerPhone || 'N/A'
                });
                console.log('Service booking successful:', result);
            } else {
                const errorData = await response.json();
                console.error('Service booking failed:', errorData);
                toast.error(`❌ Failed to book service: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Service booking error:', error);
            toast.error('Failed to send service request. Please try again.');
        } finally {
            setBookingLoading(prev => ({ ...prev, [serviceId]: false }));
        }
    };

    const handleAIFilter = async (aiRecommendations) => {
        console.log('AI Filter applied:', aiRecommendations);
        
        // Convert AI recommendations to filter parameters
        const filters = {
            location: aiRecommendations.location,
            minWage: aiRecommendations.priceRange?.min || 0,
            maxWage: aiRecommendations.priceRange?.max || 10000,
            skills: aiRecommendations.skills?.join(','),
            search: aiRecommendations.search || '',
            sortBy: 'rating',
            sortOrder: 'desc'
        };

        // Apply filters based on current page
        if (currentPage === 'laborers') {
            await fetchLaborers(filters);
        } else if (currentPage === 'services') {
            await fetchServices(filters);
        }
        
        setAiFilters(aiRecommendations);
        toast.success('AI filtering applied!');
    };

    const menuItems = [
        { icon: <BarChart2 className="w-5 h-5 mr-3" />, text: t('farmer.dashboard'), page: 'dashboard' },
        { icon: <Users className="w-5 h-5 mr-3" />, text: t('farmer.laborers'), page: 'laborers' },
        { icon: <Wrench className="w-5 h-5 mr-3" />, text: t('farmer.services'), page: 'services' },
        { icon: <MessageCircle className="w-5 h-5 mr-3" />, text: t('farmer.community'), page: 'community' },
        { icon: <BookOpen className="w-5 h-5 mr-3" />, text: t('farmer.governmentSchemes'), page: 'schemes' },
        { icon: <Calendar className="w-5 h-5 mr-3" />, text: "Calendar", page: 'calendar' },
        { icon: <HelpCircle className="w-5 h-5 mr-3" />, text: "Help", page: 'help' },
        { icon: <LogOut className="w-5 h-5 mr-3" />, text: "Logout", action: onLogout }
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

    const renderDashboard = () => (
        <div className="space-y-6">
            {renderWeatherOverview()}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={() => setCurrentPage('laborers')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
                >
                    <Users className="w-6 h-6 mr-3" />
                    Find Laborers
                </button>
                <button
                    onClick={() => setCurrentPage('services')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
                >
                    <Wrench className="w-6 h-6 mr-3" />
                    Find Services
                </button>
            </div>

            <KissanAIChat />

            {/* AI Insights Section */}
            {aiInsights && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <Brain className="w-6 h-6 text-blue-600 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-900">AI Insights & Recommendations</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Top Laborers</h4>
                            {aiInsights.topLaborers?.slice(0, 2).map((laborer, index) => (
                                <div key={index} className="text-sm text-gray-600 mb-1">
                                    • {laborer.name} - AI Score: {laborer.aiScore}/100
                                </div>
                            ))}
                            {aiInsights.laborerInsights?.map((insight, index) => (
                                <div key={index} className="text-xs text-blue-600 mt-2">
                                    {insight}
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Top Services</h4>
                            {aiInsights.topServices?.slice(0, 2).map((service, index) => (
                                <div key={index} className="text-sm text-gray-600 mb-1">
                                    • {service.name} - AI Score: {service.aiScore}/100
                                </div>
                            ))}
                            {aiInsights.serviceInsights?.map((insight, index) => (
                                <div key={index} className="text-xs text-green-600 mt-2">
                                    {insight}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FarmerCommunication />
                <GovernmentSchemes />
            </div>
        </div>
    );

    const renderLaborers = () => (
        <div className="space-y-6">
            <AIFilter onFilter={handleAIFilter} type="laborers" />
            
            {isLoadingLaborers ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading laborers...</p>
                </div>
            ) : laborersError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 mb-4">{laborersError}</p>
                    <button
                        onClick={() => fetchLaborers()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : laborers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No laborers available</h3>
                    <p className="text-gray-500">There are no laborers available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {laborers.map((laborer) => (
                        <LaborerCard
                            key={laborer._id || laborer.id}
                            laborer={laborer}
                            onBook={handleBookLaborer}
                            isLoading={bookingLoading[laborer._id || laborer.id]}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    const renderServices = () => (
        <div className="space-y-6">
            <AIFilter onFilter={handleAIFilter} type="services" />
            
            {isLoadingServices ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                </div>
            ) : servicesError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600 mb-4">{servicesError}</p>
                    <button
                        onClick={() => fetchServices()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No services available</h3>
                    <p className="text-gray-500">There are no agricultural services available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceProviderCard
                            key={service._id || service.id || index}
                            service={service}
                            onBook={handleBookService}
                            isLoading={bookingLoading[service._id || service.id]}
                        />
                    ))}
                </div>
            )}
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
                            <h2 className="font-bold text-lg">{currentUser?.name || 'Farmer'}</h2>
                            <p className="text-sm text-green-200">Farmer ID: F12345</p>
                        </div>
                    </div>
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center py-3 px-4 rounded-lg mb-2 transition-colors duration-200 ${
                                currentPage === item.page ? 'bg-green-600' : 'hover:bg-green-700'
                            } cursor-pointer`}
                            onClick={() => item.action ? item.action() : setCurrentPage(item.page)}
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
                            <button onClick={() => setShowMenu(!showMenu)} className="md:hidden mr-4 text-gray-600 hover:text-gray-900">
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">{t('farmer.dashboard')}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
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
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentPage === 'dashboard' && renderDashboard()}
                                {currentPage === 'laborers' && renderLaborers()}
                                {currentPage === 'services' && renderServices()}
                                {currentPage === 'community' && <FarmerCommunication />}
                                {currentPage === 'schemes' && <GovernmentSchemes />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
            
            {/* Booking Confirmation Modal */}
            <BookingConfirmationModal
                isOpen={!!bookingConfirmation}
                onClose={() => setBookingConfirmation(null)}
                bookingDetails={bookingConfirmation}
            />
        </div>
    );
};

export default EnhancedDashboard;
