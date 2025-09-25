import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tractor, Users, Wrench, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateAvatar } from '../utils/avatarGenerator';

const ProfileCompletion = ({ role, onProfileComplete }) => {
    const [formData, setFormData] = useState({
        location: {
            address: '',
            pincode: '',
            state: '',
            district: '',
            coordinates: { latitude: '', longitude: '' }
        },
        contactInfo: {
            email: '',
            alternateMobile: '',
            emergencyContact: ''
        }
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // const handleNestedInputChange = (section, subsection, field, value) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         [section]: {
    //             ...prev[section],
    //             [subsection]: {
    //                 ...prev[section][subsection],
    //                 [field]: value
    //             }
    //         }
    //     }));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            let endpoint = '';
            let payload = { ...formData };

            // Generate avatar for the user
            const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
            const avatarUrl = generateAvatar(userInfo.name || 'User');

            // Add role-specific data
            switch (role) {
                case 'farmer':
                    endpoint = '/api/farmer-profile';
                    payload = {
                        ...payload,
                        avatar: avatarUrl,
                        farmDetails: {
                            farmType: formData.farmType || 'crop',
                            farmSize: formData.farmSize || 0,
                            crops: formData.crops || [],
                            irrigationType: formData.irrigationType || 'manual'
                        },
                        preferences: {
                            preferredLaborTypes: formData.preferredLaborTypes || [],
                            maxWage: formData.maxWage || 0,
                            preferredServiceTypes: formData.preferredServiceTypes || []
                        }
                    };
                    break;
                case 'laborer':
                    endpoint = '/api/laborer-profile';
                    payload = {
                        ...payload,
                        avatar: avatarUrl,
                        skills: {
                            primarySkills: formData.primarySkills || [],
                            additionalSkills: formData.additionalSkills || [],
                            experience: formData.experience || 0,
                            certifications: formData.certifications || []
                        },
                        workDetails: {
                            dailyWage: formData.dailyWage || 0,
                            preferredWorkTypes: formData.preferredWorkTypes || [],
                            availability: formData.availability || 'available',
                            workRadius: formData.workRadius || 50,
                            preferredTimings: {
                                startTime: formData.startTime || '',
                                endTime: formData.endTime || '',
                                workingDays: formData.workingDays || []
                            }
                        }
                    };
                    break;
                case 'serviceProvider':
                    endpoint = '/api/service-provider-profile';
                    payload = {
                        ...payload,
                        avatar: avatarUrl,
                        businessType: formData.businessType || 'individual',
                        services: formData.services || [],
                        certifications: formData.certifications || [],
                        licenses: formData.licenses || []
                    };
                    break;
                default:
                    throw new Error('Invalid role');
            }

            const response = await fetch(`http://localhost:6002${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to complete profile');
            }

            toast.success('Profile completed successfully!');
            onProfileComplete();
        } catch (error) {
            console.error('Profile completion error:', error);
            toast.error(error.message || 'Failed to complete profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderFarmerForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farm Type
                    </label>
                    <select
                        value={formData.farmType || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, farmType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    >
                        <option value="">Select Farm Type</option>
                        <option value="crop">Crop Farm</option>
                        <option value="dairy">Dairy Farm</option>
                        <option value="poultry">Poultry Farm</option>
                        <option value="fishery">Fishery</option>
                        <option value="horticulture">Horticulture</option>
                        <option value="mixed">Mixed Farming</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Farm Size (acres)
                    </label>
                    <input
                        type="number"
                        value={formData.farmSize || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, farmSize: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crops (comma-separated)
                </label>
                <input
                    type="text"
                    value={formData.crops?.join(', ') || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Allow commas and other characters for crop names
                        setFormData(prev => ({ 
                            ...prev, 
                            crops: value.split(',').map(crop => crop.trim()).filter(crop => crop)
                        }));
                    }}
                    placeholder="e.g., Rice, Wheat, Corn, Sugarcane"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Enter crop names separated by commas
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irrigation Type
                </label>
                <select
                    value={formData.irrigationType || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, irrigationType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Select Irrigation Type</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler Irrigation</option>
                    <option value="flood">Flood Irrigation</option>
                    <option value="manual">Manual Irrigation</option>
                    <option value="none">No Irrigation</option>
                </select>
            </div>
        </div>
    );

    const renderLaborerForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Wage (₹)
                    </label>
                    <input
                        type="number"
                        value={formData.dailyWage || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, dailyWage: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (years)
                    </label>
                    <input
                        type="number"
                        value={formData.experience || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Skills (comma-separated)
                </label>
                <input
                    type="text"
                    value={formData.primarySkills?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        primarySkills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                    }))}
                    placeholder="e.g., Plowing, Harvesting, Irrigation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Radius (km)
                </label>
                <input
                    type="number"
                    value={formData.workRadius || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, workRadius: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );

    const renderServiceProviderForm = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                </label>
                <select
                    value={formData.businessType || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                >
                    <option value="">Select Business Type</option>
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                    <option value="cooperative">Cooperative</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services (comma-separated)
                </label>
                <input
                    type="text"
                    value={formData.services?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        services: e.target.value.split(',').map(service => service.trim()).filter(service => service)
                    }))}
                    placeholder="e.g., Plumbing, Electrical, Machinery Repair"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>
        </div>
    );

    const getRoleIcon = () => {
        switch (role) {
            case 'farmer': return Tractor;
            case 'laborer': return Users;
            case 'serviceProvider': return Wrench;
            default: return Tractor;
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'farmer': return 'green';
            case 'laborer': return 'blue';
            case 'serviceProvider': return 'purple';
            default: return 'green';
        }
    };

    const Icon = getRoleIcon();
    const color = getRoleColor();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${color}-100 mb-4`}>
                            <Icon className={`w-8 h-8 text-${color}-600`} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Complete Your {role.charAt(0).toUpperCase() + role.slice(1)} Profile
                        </h1>
                        <p className="text-gray-600">
                            Please provide additional information to complete your profile setup
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Location Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                                Location Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location.address}
                                        onChange={(e) => handleInputChange('location', 'address', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location.pincode}
                                        onChange={(e) => handleInputChange('location', 'pincode', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location.state}
                                        onChange={(e) => handleInputChange('location', 'state', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location.district}
                                        onChange={(e) => handleInputChange('location', 'district', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Role-specific Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {role.charAt(0).toUpperCase() + role.slice(1)} Information
                            </h3>
                            {role === 'farmer' && renderFarmerForm()}
                            {role === 'laborer' && renderLaborerForm()}
                            {role === 'serviceProvider' && renderServiceProviderForm()}
                        </div>

                        {/* Contact Information */}
                        <div className="pb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email (optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contactInfo.email}
                                        onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alternate Mobile (optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactInfo.alternateMobile}
                                        onChange={(e) => handleInputChange('contactInfo', 'alternateMobile', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Emergency Contact (optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactInfo.emergencyContact}
                                        onChange={(e) => handleInputChange('contactInfo', 'emergencyContact', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-8 py-3 bg-${color}-600 text-white rounded-lg font-semibold hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 transition-colors duration-200 flex items-center ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Completing Profile...
                                    </>
                                ) : (
                                    <>
                                        Complete Profile
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileCompletion;
