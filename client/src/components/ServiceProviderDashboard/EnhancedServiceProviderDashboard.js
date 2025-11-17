import React, { useState, useEffect } from 'react';
import { 
    Menu, ArrowLeft, Wrench, Star, MapPin, Clock, Settings, LogOut, CheckCircle, XCircle, AlertCircle,
    Edit, Bell, DollarSign, Briefcase, MessageCircle, Plus,
    Trash2, Package, BarChart3, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const EnhancedServiceProviderDashboard = ({ onBackClick, currentUser, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddService, setShowAddService] = useState(false);
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || 'Tech Services Pvt Ltd',
        businessType: 'company',
        location: 'Bangalore, Karnataka',
        rating: 4.8,
        totalServices: 45,
        completedServices: 42,
        pendingServices: 2,
        cancelledServices: 1,
        totalEarnings: 125000,
        mobileNumber: currentUser?.mobileNumber || '',
        email: currentUser?.email || ''
    });
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const [newService, setNewService] = useState({
        name: '',
        amount: '',
        mobileNumber: ''
    });

    // Fetch services from database
    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/my-services', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setServices(data.services || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Fetch bookings from database
    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/my-bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setBookings(data.bookings || []);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    // Fetch notifications from database
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Fetch messages from database
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/messages', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchServiceProviderProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/service-provider-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.serviceProvider) {
                    setProfileData(prev => ({
                        ...prev,
                        name: data.serviceProvider.name || prev.name,
                        mobileNumber: data.serviceProvider.mobileNumber || prev.mobileNumber,
                        location: data.serviceProvider.location ? 
                            `${data.serviceProvider.location.district || ''}, ${data.serviceProvider.location.state || ''}`.trim() : 
                            prev.location
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching service provider profile:', error);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchBookings();
        fetchNotifications();
        fetchMessages();
        fetchServiceProviderProfile();
    }, []);

    const handleAddService = async () => {
        if (!newService.name || newService.name.trim() === '') {
            toast.error('Please enter a service name');
            return;
        }
        
        const amount = parseInt(newService.amount);
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount greater than 0');
            return;
        }
        
        if (!newService.mobileNumber || newService.mobileNumber.trim() === '') {
            toast.error('Please enter a mobile number');
            return;
        }
        
        // Validate mobile number format (basic validation)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(newService.mobileNumber.replace(/\D/g, ''))) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to add services');
                return;
            }
            
            const response = await fetch('http://localhost:6002/api/add-service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newService.name.trim(),
                    amount: amount,
                    mobileNumber: newService.mobileNumber.replace(/\D/g, '')
                })
            });

            if (response.ok) {
                const data = await response.json();
                setServices([data.service, ...services]);
                setNewService({
                    name: '',
                    amount: '',
                    mobileNumber: ''
                });
                setShowAddService(false);
                toast.success('Service added successfully!');
                // Refresh services list
                fetchServices();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to add service' }));
                toast.error(`Failed to add service: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding service:', error);
            toast.error('Failed to add service. Please try again.');
        }
    };

    const handleDeleteService = async (serviceId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:6002/api/service/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setServices(services.filter(service => service._id !== serviceId));
                toast.success('Service deleted successfully!');
            } else {
                const errorData = await response.json();
                toast.error(`Failed to delete service: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service. Please try again.');
        }
    };

    const handleToggleService = async (serviceId) => {
        try {
            const service = services.find(s => s._id === serviceId);
            if (!service) return;

            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:6002/api/service/${serviceId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !service.isActive })
            });

            if (response.ok) {
                setServices(services.map(s => 
                    s._id === serviceId 
                        ? { ...s, isActive: !s.isActive }
                        : s
                ));
                toast.success(`Service ${!service.isActive ? 'activated' : 'deactivated'} successfully!`);
            } else {
                const errorData = await response.json();
                toast.error(`Failed to update service: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Failed to update service. Please try again.');
        }
    };

    const handleAcceptBooking = async (bookingId) => {
        // Set loading state
        setLoadingStates(prev => ({ ...prev, [`accept_${bookingId}`]: true }));
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to accept bookings');
                return;
            }

            const response = await fetch(`http://localhost:6002/api/update-booking/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'accepted' })
            });

            if (response.ok) {
                // Update local state
                setBookings(bookings.map(booking => 
                    (booking._id || booking.id) === bookingId 
                        ? { ...booking, status: 'accepted' }
                        : booking
                ));
                toast.success('✅ Booking accepted successfully!');
            } else {
                const errorData = await response.json();
                toast.error(`❌ Failed to accept booking: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast.error('Failed to accept booking. Please try again.');
        } finally {
            // Clear loading state
            setLoadingStates(prev => ({ ...prev, [`accept_${bookingId}`]: false }));
        }
    };

    const handleRejectBooking = async (bookingId) => {
        // Set loading state
        setLoadingStates(prev => ({ ...prev, [`reject_${bookingId}`]: true }));
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to reject bookings');
                return;
            }

            const response = await fetch(`http://localhost:6002/api/update-booking/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'rejected' })
            });

            if (response.ok) {
                // Update local state
                setBookings(bookings.map(booking => 
                    (booking._id || booking.id) === bookingId 
                        ? { ...booking, status: 'rejected' }
                        : booking
                ));
                toast.success('❌ Booking rejected successfully!');
            } else {
                const errorData = await response.json();
                toast.error(`❌ Failed to reject booking: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error rejecting booking:', error);
            toast.error('Failed to reject booking. Please try again.');
        } finally {
            // Clear loading state
            setLoadingStates(prev => ({ ...prev, [`reject_${bookingId}`]: false }));
        }
    };

    const handleCompleteService = (bookingId) => {
        setBookings(bookings.map(booking => 
            booking.id === bookingId 
                ? { ...booking, status: 'completed' }
                : booking
        ));
        toast.success('Service marked as completed!');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm';
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm';
            case 'completed': return 'bg-green-50 text-green-700 border border-green-200 shadow-sm';
            case 'rejected': return 'bg-red-50 text-red-700 border border-red-200 shadow-sm';
            case 'in_progress': return 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm';
            case 'cancelled': return 'bg-gray-50 text-gray-600 border border-gray-200 shadow-sm';
            default: return 'bg-gray-50 text-gray-600 border border-gray-200 shadow-sm';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'accepted': return <CheckCircle className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const menuItems = [
        { icon: <Wrench className="w-5 h-5 mr-3" />, text: "Dashboard", page: 'dashboard' },
        { icon: <Package className="w-5 h-5 mr-3" />, text: "My Services", page: 'services' },
        { icon: <Briefcase className="w-5 h-5 mr-3" />, text: "Bookings", page: 'bookings' },
        { icon: <Bell className="w-5 h-5 mr-3" />, text: "Notifications", page: 'notifications' },
        { icon: <BarChart3 className="w-5 h-5 mr-3" />, text: "Analytics", page: 'analytics' },
        { icon: <MessageCircle className="w-5 h-5 mr-3" />, text: "Messages", page: 'messages' },
        { icon: <Settings className="w-5 h-5 mr-3" />, text: "Settings", page: 'settings' },
        { icon: <LogOut className="w-5 h-5 mr-3" />, text: "Logout", action: onLogout }
    ];

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Profile Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                        <p className="text-gray-600 capitalize">{profileData.businessType} Service Provider</p>
                        <div className="flex items-center mt-2">
                            <Star className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="text-lg font-semibold">{profileData.rating}</span>
                            <span className="text-gray-500 ml-2">({profileData.totalServices} services)</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-green-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{profileData.completedServices}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <Clock className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{profileData.pendingServices}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <DollarSign className="w-8 h-8 text-yellow-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">₹{profileData.totalEarnings.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Active Services</p>
                                <p className="text-2xl font-bold text-gray-900">{services.filter(s => s.isActive && !s.isDeleted).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-indigo-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <MapPin className="w-8 h-8 text-indigo-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Service Area</p>
                                <p className="text-2xl font-bold text-gray-900">50km</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                        <div key={booking._id || booking.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {booking.farmerId?.name || 'Farmer'}
                                    </h4>
                                    <p className="text-gray-600">
                                        {booking.serviceDetails?.serviceName || 'Service'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {typeof booking.location === 'object' 
                                            ? booking.location?.address || 'Location not specified'
                                            : booking.location || 'Location not specified'
                                        }
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="ml-2 capitalize tracking-wide">{booking.status}</span>
                                    </span>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        ₹{booking.serviceDetails?.price || 1000}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderServices = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">My Services</h3>
                    <button
                        onClick={() => setShowAddService(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                    </button>
                </div>

                {showAddService && (
                    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
                        <h4 className="text-lg font-semibold mb-4">Add New Service</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                                <input
                                    type="text"
                                    value={newService.name}
                                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Plumber, Electrician, Mechanic"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={newService.amount}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        setNewService({...newService, amount: value});
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter service cost"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                                <input
                                    type="tel"
                                    value={newService.mobileNumber}
                                    onChange={(e) => setNewService({...newService, mobileNumber: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter contact number"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Add Service
                            </button>
                            <button
                                onClick={() => setShowAddService(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {services.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No services added yet</h3>
                            <p className="text-gray-500 mb-4">Click the "Add Service" button above to create your first service.</p>
                        </div>
                    ) : (
                        services.map((service) => (
                        <div key={service._id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                                    <p className="text-gray-600">Contact: {service.mobileNumber}</p>
                                    <p className="text-sm text-gray-500">
                                        Created: {new Date(service.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {service.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">₹{service.amount}</p>
                                    <p className="text-sm text-gray-500">Per service</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Rating</p>
                                    <p className="font-semibold flex items-center">
                                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                        {service.ratings || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className="font-semibold capitalize">
                                        {service.isActive ? 'Visible to Farmers' : 'Hidden from Farmers'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Service ID</p>
                                    <p className="font-semibold text-xs text-gray-500">
                                        {service._id.slice(-8)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleToggleService(service._id)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        service.isActive 
                                            ? 'bg-red-600 text-white hover:bg-red-700' 
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    {service.isActive ? 'Deactivate' : 'Reactivate'}
                                </button>
                                <button
                                    onClick={() => handleDeleteService(service._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    const renderBookings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">All Bookings</h3>
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id || booking.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {booking.farmerId?.name || 'Farmer'}
                                    </h4>
                                    <p className="text-gray-600">
                                        {booking.serviceDetails?.serviceName || 'Service'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {booking.serviceDetails?.description || 'No description available'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="ml-2 capitalize tracking-wide">{booking.status}</span>
                                    </span>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        ₹{booking.serviceDetails?.price || 1000}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Start Date</p>
                                    <p className="font-semibold">
                                        {booking.schedule?.startDate 
                                            ? new Date(booking.schedule.startDate).toLocaleDateString()
                                            : 'Not specified'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Location</p>
                                    <p className="font-semibold">
                                        {typeof booking.location === 'object' 
                                            ? booking.location?.address || 'Location not specified'
                                            : booking.location || 'Location not specified'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Contact</p>
                                    <p className="font-semibold">
                                        {booking.farmerId?.mobileNumber || '+91 98765 43210'}
                                    </p>
                                </div>
                            </div>

                            {booking.status === 'pending' && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleAcceptBooking(booking._id || booking.id)}
                                        disabled={loadingStates[`accept_${booking._id || booking.id}`] || loadingStates[`reject_${booking._id || booking.id}`]}
                                        className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                                            loadingStates[`accept_${booking._id || booking.id}`] || loadingStates[`reject_${booking._id || booking.id}`]
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                        } text-white`}
                                    >
                                        {loadingStates[`accept_${booking._id || booking.id}`] ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Accepting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Accept
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleRejectBooking(booking._id || booking.id)}
                                        disabled={loadingStates[`accept_${booking._id || booking.id}`] || loadingStates[`reject_${booking._id || booking.id}`]}
                                        className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                                            loadingStates[`accept_${booking._id || booking.id}`] || loadingStates[`reject_${booking._id || booking.id}`]
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700'
                                        } text-white`}
                                    >
                                        {loadingStates[`reject_${booking._id || booking.id}`] ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Rejecting...
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Reject
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {booking.status === 'accepted' && (
                                <button
                                    onClick={() => handleCompleteService(booking.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => {
        const earningsData = [
            { month: 'Jan', earnings: 15000 },
            { month: 'Feb', earnings: 18000 },
            { month: 'Mar', earnings: 22000 },
            { month: 'Apr', earnings: 20000 },
            { month: 'May', earnings: 25000 },
            { month: 'Jun', earnings: 28000 }
        ];

        const serviceData = [
            { service: 'Drip Irrigation', bookings: 15 },
            { service: 'Equipment Repair', bookings: 8 },
            { service: 'Soil Testing', bookings: 12 }
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Earnings Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={earningsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="earnings" stroke="#8B5CF6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Service Popularity</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={serviceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="service" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="bookings" fill="#8B5CF6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h4 className="text-lg font-semibold mb-2">This Month</h4>
                            <p className="text-3xl font-bold text-purple-600">₹28,000</p>
                            <p className="text-sm text-gray-600">+12% from last month</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h4 className="text-lg font-semibold mb-2">Average Rating</h4>
                            <p className="text-3xl font-bold text-yellow-600">4.8</p>
                            <p className="text-sm text-gray-600">Based on 42 reviews</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h4 className="text-lg font-semibold mb-2">Success Rate</h4>
                            <p className="text-3xl font-bold text-green-600">93%</p>
                            <p className="text-sm text-gray-600">42/45 completed</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderNotifications = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`border rounded-lg p-4 ${!notification.isRead ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                                    <p className="text-gray-600">{notification.message}</p>
                                    <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                                </div>
                                {!notification.isRead && (
                                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMessages = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Messages</h3>
                <div className="space-y-4">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div key={message._id || message.id} className={`border rounded-lg p-4 ${!message.isRead ? 'border-purple-200 bg-purple-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                <MessageCircle className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {message.senderName || 'Farmer'}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {message.senderType || 'Farmer'} • {message.time || 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 ml-13">{message.content || message.message}</p>
                                        {message.bookingId && (
                                            <div className="mt-2 ml-13">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Related to Booking #{message.bookingId.slice(-6)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {!message.isRead && (
                                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                            <p className="text-gray-500">You'll receive messages from farmers about service requests and updates here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const handleUpdateSettings = async () => {
        if (!profileData.name || profileData.name.trim() === '') {
            toast.error('Please enter your name');
            return;
        }
        
        if (!profileData.mobileNumber || profileData.mobileNumber.trim() === '') {
            toast.error('Please enter a mobile number');
            return;
        }
        
        // Validate mobile number format
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(profileData.mobileNumber.replace(/\D/g, ''))) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to update settings');
                return;
            }
            
            // Update service provider profile
            const response = await fetch('http://localhost:6002/api/service-provider-profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profileData.name.trim(),
                    mobileNumber: profileData.mobileNumber.replace(/\D/g, '')
                })
            });
            
            if (response.ok) {
                toast.success('Settings updated successfully!');
                fetchServiceProviderProfile();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update settings' }));
                toast.error(errorData.message || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update settings. Please try again.');
        }
    };

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter business name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                        <input
                            type="tel"
                            value={profileData.mobileNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 10) {
                                    setProfileData({...profileData, mobileNumber: value});
                                }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter mobile number"
                            maxLength={10}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter location"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                        <select
                            value={profileData.businessType}
                            onChange={(e) => setProfileData({...profileData, businessType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="company">Company</option>
                            <option value="individual">Individual</option>
                            <option value="partnership">Partnership</option>
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateSettings}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
            {/* Sidebar */}
            <div className={`w-64 bg-gradient-to-b from-purple-700 to-purple-900 text-white shadow-lg transition-all duration-300 ease-in-out ${showMenu ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <img src="/api/placeholder/40/40" alt="Profile" className="w-12 h-12 rounded-full mr-4 border-2 border-white" />
                        <div>
                            <h2 className="font-bold text-lg">{profileData.name}</h2>
                            <p className="text-sm text-purple-200">Service Provider ID: SP12345</p>
                        </div>
                    </div>
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center py-3 px-4 rounded-lg mb-2 transition-colors duration-200 ${
                                currentPage === item.page ? 'bg-purple-600' : 'hover:bg-purple-700'
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
                            <h1 className="text-2xl font-bold text-gray-900">Service Provider Dashboard</h1>
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
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50">
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
                                {currentPage === 'services' && renderServices()}
                                {currentPage === 'bookings' && renderBookings()}
                                {currentPage === 'notifications' && renderNotifications()}
                                {currentPage === 'analytics' && renderAnalytics()}
                                {currentPage === 'messages' && renderMessages()}
                                {currentPage === 'settings' && renderSettings()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EnhancedServiceProviderDashboard;
