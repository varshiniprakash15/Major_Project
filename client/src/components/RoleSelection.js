import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tractor, Users, Wrench, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const RoleSelection = ({ onRoleSelected, userData }) => {
    const { t } = useLanguage();
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        {
            id: 'farmer',
            title: t('roles.farmer'),
            description: t('roles.farmerDesc'),
            icon: Tractor,
            color: 'green',
            features: [
                t('farmer.weather'),
                t('farmer.laborers'),
                t('farmer.services'),
                t('farmer.governmentSchemes'),
                t('farmer.community')
            ]
        },
        {
            id: 'laborer',
            title: t('roles.laborer'),
            description: t('roles.laborerDesc'),
            icon: Users,
            color: 'blue',
            features: [
                t('laborer.skills'),
                t('laborer.availability'),
                t('laborer.jobs'),
                t('laborer.workHistory'),
                t('laborer.rating')
            ]
        },
        {
            id: 'serviceProvider',
            title: t('roles.serviceProvider'),
            description: t('roles.serviceProviderDesc'),
            icon: Wrench,
            color: 'purple',
            features: [
                t('serviceProvider.services'),
                t('serviceProvider.bookings'),
                t('serviceProvider.earnings'),
                t('serviceProvider.profile'),
                t('serviceProvider.contactInfo')
            ]
        }
    ];

    const handleRoleSelect = async (roleId) => {
        setSelectedRole(roleId);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6002/api/select-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: roleId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to select role');
            }

            toast.success('Role selected successfully!');
            onRoleSelected(roleId);
        } catch (error) {
            console.error('Role selection error:', error);
            toast.error(error.message || 'Failed to select role. Please try again.');
            setSelectedRole('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {t('roles.selectRole')}, {userData?.name}!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        {t('roles.selectRole')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;
                        const isRoleLoading = selectedRole === role.id && isLoading;

                        return (
                            <motion.div
                                key={role.id}
                                className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-300 ${
                                    isSelected 
                                        ? `ring-4 ring-${role.color}-500 shadow-2xl` 
                                        : 'hover:shadow-xl hover:scale-105'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleSelect(role.id)}
                            >
                                {isSelected && (
                                    <div className="absolute top-4 right-4">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${role.color}-100 mb-4`}>
                                        <Icon className={`w-10 h-10 text-${role.color}-600`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {role.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {role.description}
                                    </p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {role.features.map((feature, index) => (
                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${
                                        isSelected
                                            ? `bg-${role.color}-600 hover:bg-${role.color}-700`
                                            : `bg-${role.color}-500 hover:bg-${role.color}-600`
                                    }`}
                                    disabled={isRoleLoading}
                                >
                                    {isRoleLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            {t('common.loading')}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            {t('roles.selectRole')} {role.title}
                                            <ArrowRight className="w-5 h-5 ml-2" />
                                        </div>
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-500 text-sm">
                        You can change your role later in your profile settings
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
