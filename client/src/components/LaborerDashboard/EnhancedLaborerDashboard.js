import React, { useState, useEffect } from 'react';
import { 
    Menu, ArrowLeft, Users, Star, MapPin, Clock, Settings, LogOut, CheckCircle, XCircle, AlertCircle,
    Edit, Bell, DollarSign, Briefcase, MessageCircle, TrendingUp, Save, Wrench, Plus, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EnhancedLaborerDashboard = ({ onBackClick, currentUser, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || 'John Doe',
        skills: ['Plowing', 'Harvesting', 'Irrigation'],
        dailyWage: 500,
        experience: 5,
        workRadius: 25,
        availability: 'available',
        location: 'Tumkur, Karnataka',
        rating: 4.5,
        totalJobs: 127,
        completedJobs: 120,
        pendingJobs: 3,
        cancelledJobs: 4,
        isActive: true,
        isDeleted: false
    });
    const [bookings, setBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const [showAddService, setShowAddService] = useState(false);
    const [newService, setNewService] = useState({
        workType: '',
        dailyWage: 500,
        skills: []
    });

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

    const fetchLaborerProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:6002/api/my-laborer-profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const l = data.laborer;
                setProfileData(prev => ({
                    ...prev,
                    name: l.name || prev.name,
                    dailyWage: l.workDetails?.dailyWage ?? prev.dailyWage,
                    availability: l.workDetails?.availability || prev.availability,
                    skills: l.skills?.primarySkills?.length ? l.skills.primarySkills : prev.skills,
                    location: `${l.location?.district || ''}, ${l.location?.state || ''}`.trim(),
                    isActive: l.isActive,
                    isDeleted: l.isDeleted
                }));
            }
        } catch (e) {
            console.error('Error fetching laborer profile', e);
        }
    };

    useEffect(() => {
        fetchLaborerProfile();
        fetchBookings();
        fetchNotifications();
        fetchMessages();
    }, []);

    const handleUpdateProfile = async () => {
        if (!profileData.name || profileData.name.trim() === '') {
            toast.error('Please enter your name');
            return;
        }
        
        if (!profileData.dailyWage || profileData.dailyWage <= 0) {
            toast.error('Please enter a valid daily wage');
            return;
        }
        
        if (!profileData.workRadius || profileData.workRadius <= 0) {
            toast.error('Please enter a valid work radius');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to update profile');
                return;
            }
            
            const body = {
                workType: (profileData.skills && profileData.skills.length > 0 && profileData.skills[0]) || 'harvesting',
                dailyWage: profileData.dailyWage,
                mobileNumber: currentUser?.mobileNumber,
                availability: profileData.availability || 'available',
                skills: Array.isArray(profileData.skills) ? profileData.skills : []
            };
            
            const res = await fetch('http://localhost:6002/api/laborer', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            
            if (res.ok) {
                toast.success('Profile updated successfully!');
                const data = await res.json();
                setProfileData(prev => ({ 
                    ...prev, 
                    isActive: data.laborer?.isActive ?? prev.isActive,
                    dailyWage: data.laborer?.workDetails?.dailyWage ?? prev.dailyWage,
                    skills: data.laborer?.skills?.primarySkills ?? prev.skills
                }));
                setIsEditing(false);
            } else {
                const err = await res.json().catch(() => ({ message: 'Failed to update profile' }));
                toast.error(err.message || 'Failed to update profile');
            }
        } catch (e) {
            console.error('Update profile error', e);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    const handleToggleActive = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to change profile status');
                return;
            }
            
            const res = await fetch('http://localhost:6002/api/laborer/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !profileData.isActive })
            });
            
            if (res.ok) {
                const newStatus = !profileData.isActive;
                setProfileData(prev => ({ ...prev, isActive: newStatus }));
                toast.success(newStatus ? 'Profile reactivated successfully' : 'Profile deactivated successfully');
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Failed to update status' }));
                toast.error(errorData.message || 'Failed to update profile status');
            }
        } catch (e) {
            console.error('Toggle active error', e);
            toast.error('Failed to update profile status. Please try again.');
        }
    };

    const handleDeleteProfile = async () => {
        if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to delete profile');
                return;
            }
            
            const res = await fetch('http://localhost:6002/api/laborer', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                setProfileData(prev => ({ ...prev, isDeleted: true, isActive: false }));
                toast.success('Profile deleted successfully');
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Failed to delete profile' }));
                toast.error(errorData.message || 'Failed to delete profile');
            }
        } catch (e) {
            console.error('Delete profile error', e);
            toast.error('Failed to delete profile. Please try again.');
        }
    };

    const handleAddService = async () => {
        if (!newService.workType) {
            toast.error('Please select a work type');
            return;
        }
        
        if (!newService.dailyWage || newService.dailyWage <= 0) {
            toast.error('Please enter a valid daily wage');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to update service');
                return;
            }
            
            const res = await fetch('http://localhost:6002/api/laborer', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    workType: newService.workType,
                    dailyWage: newService.dailyWage,
                    mobileNumber: currentUser?.mobileNumber,
                    availability: 'available',
                    skills: newService.skills.length > 0 ? newService.skills : profileData.skills
                })
            });
            
            if (res.ok) {
                const data = await res.json();
                setProfileData(prev => ({
                    ...prev,
                    dailyWage: data.laborer.workDetails?.dailyWage || newService.dailyWage,
                    skills: data.laborer.skills?.primarySkills || newService.skills || prev.skills
                }));
                setNewService({ workType: '', dailyWage: 500, skills: [] });
                setShowAddService(false);
                toast.success('Service updated successfully!');
            } else {
                const err = await res.json().catch(() => ({ message: 'Failed to update service' }));
                toast.error(err.message || 'Failed to update service');
            }
        } catch (e) {
            console.error('Add service error', e);
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

    const handleCompleteJob = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to complete jobs');
                return;
            }

            const response = await fetch(`http://localhost:6002/api/update-booking/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'completed' })
            });

            if (response.ok) {
                setBookings(bookings.map(booking => 
                    (booking._id || booking.id) === bookingId 
                        ? { ...booking, status: 'completed' }
                        : booking
                ));
                toast.success('Job marked as completed!');
            } else {
                const errorData = await response.json();
                toast.error(`Failed to complete job: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error completing job:', error);
            toast.error('Failed to complete job. Please try again.');
        }
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
        { icon: <Users className="w-5 h-5 mr-3" />, text: "Dashboard", page: 'dashboard' },
        { icon: <Briefcase className="w-5 h-5 mr-3" />, text: "My Jobs", page: 'jobs' },
        { icon: <Wrench className="w-5 h-5 mr-3" />, text: "My Services", page: 'services' },
        { icon: <Bell className="w-5 h-5 mr-3" />, text: "Notifications", page: 'notifications' },
        { icon: <TrendingUp className="w-5 h-5 mr-3" />, text: "Analytics", page: 'analytics' },
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
                        <p className="text-gray-600">Agricultural Laborer</p>
                        <div className="flex items-center mt-2">
                            <Star className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="text-lg font-semibold">{profileData.rating}</span>
                            <span className="text-gray-500 ml-2">({profileData.totalJobs} jobs)</span>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleToggleActive}
                            className={`px-4 py-2 rounded-lg text-white transition-colors ${profileData.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {profileData.isActive ? 'Deactivate' : 'Reactivate'}
                        </button>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                        <button
                            onClick={handleDeleteProfile}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Completed Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{profileData.completedJobs}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <Clock className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Pending Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{profileData.pendingJobs}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <DollarSign className="w-8 h-8 text-yellow-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Daily Wage</p>
                                <p className="text-2xl font-bold text-gray-900">₹{profileData.dailyWage}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                        <div className="flex items-center">
                            <MapPin className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Work Radius</p>
                                <p className="text-2xl font-bold text-gray-900">{profileData.workRadius}km</p>
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
                                        {booking.workDetails?.workType || 'Farm Work'} - {booking.workDetails?.duration || 1} days
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
                                        ₹{booking.workDetails?.dailyWage || 500}/day
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Update Service
                    </button>
                </div>

                {showAddService && (
                    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
                        <h4 className="text-lg font-semibold mb-4">Update Service Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Work Type *</label>
                                <select
                                    value={newService.workType}
                                    onChange={(e) => setNewService({...newService, workType: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Work Type</option>
                                    <option value="harvesting">Harvesting</option>
                                    <option value="plowing">Plowing</option>
                                    <option value="irrigation">Irrigation</option>
                                    <option value="seeding">Seeding</option>
                                    <option value="fertilizing">Fertilizing</option>
                                    <option value="planting">Planting</option>
                                    <option value="weeding">Weeding</option>
                                    <option value="pruning">Pruning</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Wage (₹) *</label>
                                <input
                                    type="number"
                                    value={newService.dailyWage}
                                    onChange={(e) => setNewService({...newService, dailyWage: parseInt(e.target.value) || 0})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter daily wage"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    value={Array.isArray(newService.skills) ? newService.skills.join(', ') : ''}
                                    onChange={(e) => setNewService({...newService, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Harvesting, Plowing, Irrigation"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Update Service
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
                    <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">{profileData.name}</h4>
                                <p className="text-gray-600">Agricultural Laborer</p>
                                <p className="text-sm text-gray-500">
                                    Status: {profileData.isActive ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    profileData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {profileData.isActive ? 'Available' : 'Unavailable'}
                                </span>
                                <p className="text-lg font-semibold text-gray-900 mt-1">₹{profileData.dailyWage}/day</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Skills</p>
                                <p className="font-semibold">
                                    {Array.isArray(profileData.skills) ? profileData.skills.join(', ') : 'General Labor'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Experience</p>
                                <p className="font-semibold">{profileData.experience} years</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Work Radius</p>
                                <p className="font-semibold">{profileData.workRadius}km</p>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={handleToggleActive}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    profileData.isActive 
                                        ? 'bg-red-600 text-white hover:bg-red-700' 
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            >
                                {profileData.isActive ? 'Deactivate' : 'Reactivate'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderJobs = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">All Jobs</h3>
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id || booking.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        {booking.farmerId?.name || 'Farmer'}
                                    </h4>
                                    <p className="text-gray-600">
                                        {booking.workDetails?.workType || 'Farm Work'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {booking.workDetails?.description || 'No description available'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="ml-2 capitalize tracking-wide">{booking.status}</span>
                                    </span>
                                    <p className="text-lg font-semibold text-gray-900 mt-2">
                                        ₹{booking.workDetails?.dailyWage || 500}/day
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="font-semibold">{booking.workDetails?.duration || 1} days</p>
                                </div>
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
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="font-semibold">
                                        ₹{(booking.workDetails?.dailyWage || 500) * (booking.workDetails?.duration || 1)}
                                    </p>
                                </div>
                            </div>

                            {booking.status === 'pending' && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAcceptBooking(booking._id || booking.id);
                                        }}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRejectBooking(booking._id || booking.id);
                                        }}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCompleteJob(booking._id || booking.id);
                                    }}
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

    const renderNotifications = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`border rounded-lg p-4 ${!notification.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                                    <p className="text-gray-600">{notification.message}</p>
                                    <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                                </div>
                                {!notification.isRead && (
                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => {
        const earningsData = [
            { month: 'Jan', earnings: 12000 },
            { month: 'Feb', earnings: 15000 },
            { month: 'Mar', earnings: 18000 },
            { month: 'Apr', earnings: 16000 },
            { month: 'May', earnings: 20000 },
            { month: 'Jun', earnings: 22000 }
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
                            <Line type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="text-lg font-semibold mb-2">This Month</h4>
                        <p className="text-3xl font-bold text-green-600">₹22,000</p>
                        <p className="text-sm text-gray-600">+10% from last month</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="text-lg font-semibold mb-2">Average Rating</h4>
                        <p className="text-3xl font-bold text-yellow-600">4.5</p>
                        <p className="text-sm text-gray-600">Based on 120 reviews</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="text-lg font-semibold mb-2">Job Success Rate</h4>
                        <p className="text-3xl font-bold text-blue-600">94%</p>
                        <p className="text-sm text-gray-600">120/127 completed</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderMessages = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Messages</h3>
                <div className="space-y-4">
                    {messages.length > 0 ? (
                        messages.map((message) => (
                            <div key={message._id || message.id} className={`border rounded-lg p-4 ${!message.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <MessageCircle className="w-5 h-5 text-blue-600" />
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
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                            <p className="text-gray-500">You'll receive messages from farmers about job opportunities and updates here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Daily Wage (₹)</label>
                        <input
                            type="number"
                            value={profileData.dailyWage}
                            onChange={(e) => setProfileData({...profileData, dailyWage: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Radius (km)</label>
                        <input
                            type="number"
                            value={profileData.workRadius}
                            onChange={(e) => setProfileData({...profileData, workRadius: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                        <input
                            type="text"
                            value={Array.isArray(profileData.skills) ? profileData.skills.join(', ') : ''}
                            onChange={(e) => setProfileData({...profileData, skills: e.target.value.split(',').map(s => s.trim())})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleUpdateProfile}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Sidebar */}
            <div className={`w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg transition-all duration-300 ease-in-out ${showMenu ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <img src="/api/placeholder/40/40" alt="Profile" className="w-12 h-12 rounded-full mr-4 border-2 border-white" />
                        <div>
                            <h2 className="font-bold text-lg">{profileData.name}</h2>
                            <p className="text-sm text-blue-200">Laborer ID: L12345</p>
                        </div>
                    </div>
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center py-3 px-4 rounded-lg mb-2 transition-colors duration-200 ${
                                currentPage === item.page ? 'bg-blue-600' : 'hover:bg-blue-700'
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
                            <h1 className="text-2xl font-bold text-gray-900">Laborer Dashboard</h1>
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
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-50">
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
                                {currentPage === 'jobs' && renderJobs()}
                                {currentPage === 'services' && renderServices()}
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

export default EnhancedLaborerDashboard;
