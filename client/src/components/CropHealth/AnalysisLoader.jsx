import React from 'react';
import { motion } from 'framer-motion';
import { Bug, Leaf, TrendingUp, Loader2 } from 'lucide-react';

const AnalysisLoader = ({ type, message, imageThumbnail }) => {
    // Color themes based on type
    const themes = {
        disease: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-600',
            icon: 'text-red-500',
            gradient: 'from-red-400 to-red-600'
        },
        fertilizer: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-600',
            icon: 'text-green-500',
            gradient: 'from-green-400 to-green-600'
        },
        market: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-600',
            icon: 'text-blue-500',
            gradient: 'from-blue-400 to-blue-600'
        }
    };

    const theme = themes[type] || themes.disease;

    // Icon component based on type
    const IconComponent = {
        disease: Bug,
        fertilizer: Leaf,
        market: TrendingUp
    }[type] || Bug;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${theme.bg} rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 ${theme.border}`}
            >
                {/* Image Thumbnail */}
                {imageThumbnail && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-center mb-6"
                    >
                        <img
                            src={imageThumbnail}
                            alt="Selected"
                            className="w-24 h-24 rounded-lg object-cover shadow-lg ring-2 ring-white"
                        />
                    </motion.div>
                )}

                {/* Animated Icon */}
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className={`relative`}
                    >
                        {/* Pulse effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${theme.gradient} blur-xl`}
                        />
                        
                        <div className={`relative ${theme.icon} bg-white rounded-full p-4 shadow-lg`}>
                            <IconComponent size={48} strokeWidth={2.5} />
                        </div>
                    </motion.div>
                </div>

                {/* Spinning Loader */}
                <div className="flex justify-center mb-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <Loader2 className={`${theme.icon} w-12 h-12`} />
                    </motion.div>
                </div>

                {/* Loading Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
                        {message}
                    </h3>
                    
                    {/* Animated dots */}
                    <motion.div
                        className={`text-lg ${theme.text} font-medium`}
                    >
                        ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            ...
                        </motion.span>
                    </motion.div>
                </motion.div>

                {/* Progress bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="mt-6 h-1 bg-gradient-to-r ${theme.gradient} rounded-full"
                />

                {/* Type-specific animation */}
                {type === 'disease' && (
                    <motion.div
                        className="mt-4 text-center text-sm text-gray-600"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🔍 ಸ್ಕ್ಯಾನಿಂಗ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
                    </motion.div>
                )}

                {type === 'fertilizer' && (
                    <motion.div
                        className="mt-4 text-center text-sm text-gray-600"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🌱 ಶಿಫಾರಸು ತಯಾರಿಸಲಾಗುತ್ತಿದೆ...
                    </motion.div>
                )}

                {type === 'market' && (
                    <motion.div
                        className="mt-4 text-center text-sm text-gray-600"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        📊 ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ...
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default AnalysisLoader;
