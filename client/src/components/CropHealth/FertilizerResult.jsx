import React from 'react';
import { motion } from 'framer-motion';
import { 
    Sprout, Droplet, Sun, Calendar, Scale, 
    AlertTriangle, Printer, Share2, CheckCircle
} from 'lucide-react';

const FertilizerResult = ({ data }) => {
    const handlePrint = () => window.print();
    
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'ಗೊಬ್ಬರ ಶಿಫಾರಸು',
                    text: `${data.crop_type} - ${data.fertilizer_type}`,
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-4 space-y-6"
        >
            {/* Action Buttons */}
            <div className="flex justify-end gap-2 print:hidden">
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Printer size={18} />
                    <span>ಪ್ರಿಂಟ್</span>
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                    <Share2 size={18} />
                    <span>ಹಂಚಿಕೊಳ್ಳಿ</span>
                </button>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    <Sprout size={32} />
                    <h2 className="text-2xl font-bold">ಗೊಬ್ಬರ ಶಿಫಾರಸು</h2>
                </div>
                <p className="text-xl opacity-90">{data.crop_type}</p>
            </div>

            {/* Soil Condition */}
            {data.soil_condition && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-900 mb-2">ಮಣ್ಣಿನ ಸ್ಥಿತಿ</h3>
                    <p className="text-amber-800">{data.soil_condition}</p>
                </div>
            )}

            {/* NPK Ratio - Hero Display */}
            {data.npk_ratio && (
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-2xl">
                    <div className="text-center">
                        <p className="text-sm opacity-80 mb-2">ಶಿಫಾರಸು ಮಾಡಲಾದ NPK ಅನುಪಾತ</p>
                        <p className="text-5xl font-bold mb-2">{data.npk_ratio}</p>
                        {data.primary_need && (
                            <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold">
                                {data.primary_need}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Fertilizer Type */}
            {data.fertilizer_type && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="text-green-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">ಶಿಫಾರಸು ಮಾಡಲಾದ ಗೊಬ್ಬರ</h3>
                    </div>
                    <p className="text-xl text-gray-800 font-semibold">{data.fertilizer_type}</p>
                </div>
            )}

            {/* Quantity */}
            {data.quantity && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                        <Scale className="text-blue-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">ಪ್ರಮಾಣ</h3>
                    </div>
                    <p className="text-2xl text-blue-600 font-bold">{data.quantity}</p>
                </div>
            )}

            {/* Application Method */}
            {data.application_method && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">ಅನ್ವಯಿಸುವ ವಿಧಾನ</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">{data.application_method}</p>
                    </div>
                </div>
            )}

            {/* Application Frequency */}
            {data.application_frequency && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                        <Calendar className="text-purple-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">ಅನ್ವಯಿಸುವ ಆವರ್ತನ</h3>
                    </div>
                    <p className="text-purple-800 text-lg">{data.application_frequency}</p>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Watering Needs */}
                {data.watering_needs && (
                    <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Droplet className="text-cyan-600" size={24} />
                            <h3 className="text-lg font-bold text-cyan-900">ನೀರಾವರಿ ಅಗತ್ಯತೆ</h3>
                        </div>
                        <p className="text-cyan-800">{data.watering_needs}</p>
                    </div>
                )}

                {/* Best Time */}
                {data.best_time && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Sun className="text-yellow-600" size={24} />
                            <h3 className="text-lg font-bold text-yellow-900">ಉತ್ತಮ ಸಮಯ</h3>
                        </div>
                        <p className="text-yellow-800">{data.best_time}</p>
                    </div>
                )}
            </div>

            {/* Additional Nutrients */}
            {data.additional_nutrients && data.additional_nutrients.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">ಹೆಚ್ಚುವರಿ ಪೋಷಕಾಂಶಗಳು</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.additional_nutrients.map((nutrient, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm"
                            >
                                {nutrient}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Warnings */}
            {data.warnings && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ ಎಚ್ಚರಿಕೆಗಳು</h3>
                            <p className="text-red-800 leading-relaxed whitespace-pre-line">{data.warnings}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Note */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-800">
                    <strong>ಸೂಚನೆ:</strong> ಸ್ಥಳೀಯ ಮಣ್ಣು ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರಮಾಣವನ್ನು ಸರಿಹೊಂದಿಸಿ.
                </p>
            </div>
        </motion.div>
    );
};

export default FertilizerResult;
