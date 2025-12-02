import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Leaf, TrendingUp, Camera, Image as ImageIcon, RefreshCw, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { validateImage, compressImage, removeBase64Prefix, processImageForAPI } from '../../utils/imageUtils';
import AnalysisLoader from './AnalysisLoader';
import SuccessAnimation from './SuccessAnimation';
import DiseaseResult from './DiseaseResult';
import FertilizerResult from './FertilizerResult';
import MarketResult from './MarketResult';

const CropHealthDashboard = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Clean base64 for API
    const [imagePreview, setImagePreview] = useState(null); // Base64 with prefix for display
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const cameraInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const analysisTypes = [
        {
            id: 'disease',
            title: 'ರೋಗ ಪತ್ತೆ',
            description: 'ಬೆಳೆ ರೋಗಗಳನ್ನು ಗುರುತಿಸಿ',
            icon: Bug,
            color: 'red',
            gradient: 'from-red-500 to-red-600',
            hoverGradient: 'hover:from-red-600 hover:to-red-700',
            borderColor: 'border-red-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
        },
        {
            id: 'fertilizer',
            title: 'ಗೊಬ್ಬರ ಶಿಫಾರಸು',
            description: 'ಗೊಬ್ಬರ ಸಲಹೆ ಪಡೆಯಿರಿ',
            icon: Leaf,
            color: 'green',
            gradient: 'from-green-500 to-green-600',
            hoverGradient: 'hover:from-green-600 hover:to-green-700',
            borderColor: 'border-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            id: 'market',
            title: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
            description: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ತಿಳಿಯಿರಿ',
            icon: TrendingUp,
            color: 'blue',
            gradient: 'from-blue-500 to-blue-600',
            hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        }
    ];

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setSelectedImage(null);
        setImagePreview(null);
        setResult(null);
        setError(null);
    };

    const handleImageSelect = async (event, source) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate image
        const validation = validateImage(file);
        if (!validation.valid) {
            toast.error(validation.error);
            return;
        }

        try {
            // Compress and convert to base64 (with prefix for preview)
            const base64WithPrefix = await compressImage(file);
            
            // Store preview version (with data URI prefix)
            setImagePreview(base64WithPrefix);
            
            // Remove prefix for API call
            const cleanBase64 = removeBase64Prefix(base64WithPrefix);
            setSelectedImage(cleanBase64);
            
            setError(null);
            toast.success('ಚಿತ್ರ ಆಯ್ಕೆಯಾಗಿದೆ!');
            
            console.log('Image processed:');
            console.log('- Preview length (with prefix):', base64WithPrefix.length);
            console.log('- API length (clean):', cleanBase64.length);
            console.log('- Preview starts with:', base64WithPrefix.substring(0, 30));
            console.log('- Clean starts with:', cleanBase64.substring(0, 30));
        } catch (err) {
            console.error('Image processing error:', err);
            toast.error('ಚಿತ್ರ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ದೋಷ');
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage || !selectedType) {
            toast.error('ದಯವಿಟ್ಟು ಚಿತ್ರ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            // Prepare API payload with clean base64 (no prefix)
            const payload = {
                type: selectedType,
                image: selectedImage // This is already clean base64 without prefix
            };
            
            console.log('Sending to API:');
            console.log('- Type:', payload.type);
            console.log('- Image length:', payload.image.length);
            console.log('- Image starts with:', payload.image.substring(0, 50));
            console.log('- Has data URI prefix?', payload.image.startsWith('data:'));
            
            const response = await axios.post('https://n8n-hn7y.onrender.com/webhook-test/agri-assistant', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response:', response.data);

            if (response.data && response.data.success) {
                setIsAnalyzing(false);
                setShowSuccess(true);
                
                // Wait for success animation to complete
                setTimeout(() => {
                    setResult(response.data.result);
                }, 1500);
            } else {
                throw new Error('ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            console.error('Error details:', err.response?.data);
            setIsAnalyzing(false);
            setError(err.response?.data?.message || 'ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
            toast.error('ವಿಶ್ಲೇಷಣೆ ವಿಫಲವಾಗಿದೆ');
        }
    };

    const handleReset = () => {
        setSelectedType(null);
        setSelectedImage(null);
        setImagePreview(null);
        setResult(null);
        setError(null);
        setShowSuccess(false);
    };

    const getLoadingMessage = (type) => {
        const messages = {
            disease: 'ರೋಗ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ... ⏳',
            fertilizer: 'ಗೊಬ್ಬರ ಶಿಫಾರಸು ತಯಾರಿಸಲಾಗುತ್ತಿದೆ... 🌱',
            market: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಪಡೆಯಲಾಗುತ್ತಿದೆ... 📊'
        };
        return messages[type] || 'ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                        ಕ್ರಾಪ್ ಹೆಲ್ತ್ ಸಹಾಯಕ
                    </h1>
                    <p className="text-gray-600 text-lg">
                        AI ಆಧಾರಿತ ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸಲಹೆ
                    </p>
                </motion.div>

                {/* Analysis Type Selection */}
                {!result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            ವಿಶ್ಲೇಷಣೆಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {analysisTypes.map((type) => {
                                const IconComponent = type.icon;
                                const isSelected = selectedType === type.id;

                                return (
                                    <motion.button
                                        key={type.id}
                                        onClick={() => handleTypeSelect(type.id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                                            relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300
                                            ${isSelected ? `ring-4 ${type.borderColor} ${type.bgColor}` : 'bg-white hover:shadow-2xl'}
                                            p-6
                                        `}
                                    >
                                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${type.gradient}`} />
                                        
                                        <div className="text-center">
                                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${type.bgColor}`}>
                                                <IconComponent className={type.textColor} size={40} strokeWidth={2.5} />
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {type.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {type.description}
                                            </p>
                                        </div>

                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-4 right-4"
                                            >
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${type.gradient} flex items-center justify-center`}>
                                                    <span className="text-white font-bold">✓</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Image Upload Section */}
                <AnimatePresence>
                    {selectedType && !result && !isAnalyzing && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                    {!imagePreview ? 'ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'ಚಿತ್ರ ಪೂರ್ವವೀಕ್ಷಣೆ'}
                                </h2>

                                {!imagePreview ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Camera Upload */}
                                        <button
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl"
                                        >
                                            <div className="text-center">
                                                <Camera size={64} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                                <p className="text-2xl font-bold mb-2">📷 ಫೋಟೋ ತೆಗೆಯಿರಿ</p>
                                                <p className="text-sm opacity-90">ಕ್ಯಾಮರಾ ತೆರೆಯಿರಿ</p>
                                            </div>
                                            <input
                                                ref={cameraInputRef}
                                                type="file"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={(e) => handleImageSelect(e, 'camera')}
                                                className="hidden"
                                            />
                                        </button>

                                        {/* Gallery Upload */}
                                        <button
                                            onClick={() => galleryInputRef.current?.click()}
                                            className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl"
                                        >
                                            <div className="text-center">
                                                <ImageIcon size={64} className="mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                                <p className="text-2xl font-bold mb-2">🖼️ ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ</p>
                                                <p className="text-sm opacity-90">ಗ್ಯಾಲರಿ ತೆರೆಯಿರಿ</p>
                                            </div>
                                            <input
                                                ref={galleryInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageSelect(e, 'gallery')}
                                                className="hidden"
                                            />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Image Preview */}
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Selected"
                                                className="max-w-full h-auto max-h-96 mx-auto rounded-xl shadow-lg"
                                            />
                                            <button
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4 justify-center">
                                            <button
                                                onClick={handleAnalyze}
                                                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                                            >
                                                <span>ವಿಶ್ಲೇಷಿಸಿ</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="flex items-center gap-2 px-8 py-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                                            >
                                                <RefreshCw size={20} />
                                                <span>ಮತ್ತೆ ಆಯ್ಕೆಮಾಡಿ</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Error Display */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800"
                                    >
                                        <p className="font-semibold">⚠️ {error}</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Loading State */}
                {isAnalyzing && (
                    <AnalysisLoader
                        type={selectedType}
                        message={getLoadingMessage(selectedType)}
                        imageThumbnail={imagePreview}
                    />
                )}

                {/* Success Animation */}
                {showSuccess && (
                    <SuccessAnimation onComplete={() => setShowSuccess(false)} />
                )}

                {/* Results Display */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {selectedType === 'disease' && <DiseaseResult data={result} />}
                            {selectedType === 'fertilizer' && <FertilizerResult data={result} />}
                            {selectedType === 'market' && <MarketResult data={result} />}

                            {/* New Analysis Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                                >
                                    <RefreshCw size={24} />
                                    <span>ಹೊಸ ವಿಶ್ಲೇಷಣೆ</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CropHealthDashboard;
