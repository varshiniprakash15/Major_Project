import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Sprout, AlertCircle, CheckCircle, Bug, Droplet, 
    ChevronDown, ChevronUp, Shield, Activity, AlertTriangle,
    Printer, Share2
} from 'lucide-react';

const DiseaseResult = ({ data }) => {
    const [expandedSections, setExpandedSections] = useState({
        symptoms: false,
        treatment: false,
        prevention: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Severity color mapping
    const getSeverityColor = (severity) => {
        const severityLower = severity?.toLowerCase() || 'n/a';
        if (severityLower === 'low') return 'bg-green-100 text-green-800 border-green-300';
        if (severityLower === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        if (severityLower === 'high') return 'bg-red-100 text-red-800 border-red-300';
        if (severityLower === 'critical') return 'bg-red-600 text-white border-red-700';
        return 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Urgency banner color
    const getUrgencyBanner = (urgency) => {
        const urgencyLower = urgency?.toLowerCase() || 'n/a';
        if (urgencyLower.includes('immediate')) {
            return { bg: 'bg-red-500', text: 'ತುರ್ತು ಕ್ರಮ ಅಗತ್ಯ', icon: '🚨' };
        }
        if (urgencyLower.includes('week')) {
            return { bg: 'bg-yellow-500', text: 'ಈ ವಾರದೊಳಗೆ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ', icon: '⚠️' };
        }
        if (urgencyLower.includes('routine')) {
            return { bg: 'bg-green-500', text: 'ನಿಯಮಿತ ನಿರ್ವಹಣೆ', icon: '✅' };
        }
        return { bg: 'bg-gray-500', text: 'ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ', icon: 'ℹ️' };
    };

    const urgencyBanner = getUrgencyBanner(data.urgency);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'ಬೆಳೆ ರೋಗ ವಿಶ್ಲೇಷಣೆ',
                    text: `${data.crop_type} - ${data.disease}`,
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
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <Printer size={18} />
                    <span>ಪ್ರಿಂಟ್</span>
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                >
                    <Share2 size={18} />
                    <span>ಹಂಚಿಕೊಳ್ಳಿ</span>
                </button>
            </div>

            {/* Urgency Banner */}
            {data.urgency && data.urgency.toLowerCase() !== 'n/a' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${urgencyBanner.bg} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}
                >
                    <span className="text-2xl">{urgencyBanner.icon}</span>
                    <span className="text-lg font-bold">{urgencyBanner.text}</span>
                </motion.div>
            )}

            {/* Header - Crop Type */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    <Sprout size={32} />
                    <h2 className="text-2xl font-bold">ಬೆಳೆ ರೋಗ ವಿಶ್ಲೇಷಣೆ</h2>
                </div>
                <p className="text-xl opacity-90">{data.crop_type}</p>
            </div>

            {/* Disease Name and Severity */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h3 className="text-gray-600 text-sm mb-2">ರೋಗದ ಹೆಸರು</h3>
                        <p className="text-2xl font-bold text-gray-900">{data.disease}</p>
                    </div>
                    {data.severity && data.severity.toLowerCase() !== 'n/a' && (
                        <div className={`px-4 py-2 rounded-full border-2 font-semibold ${getSeverityColor(data.severity)}`}>
                            {data.severity}
                        </div>
                    )}
                </div>

                {/* Confidence Level */}
                {data.confidence && (
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">ವಿಶ್ವಾಸ ಮಟ್ಟ</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {data.confidence === 'high' ? 'ಹೆಚ್ಚು' : 
                                 data.confidence === 'medium' ? 'ಮಧ್ಯಮ' : 'ಕಡಿಮೆ'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className={`h-3 rounded-full ${
                                    data.confidence === 'high' ? 'bg-green-500 w-full' :
                                    data.confidence === 'medium' ? 'bg-yellow-500 w-2/3' :
                                    'bg-red-500 w-1/3'
                                }`}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Pest Alert */}
            {data.pest && typeof data.pest === 'string' && data.pest.toLowerCase() !== 'none' && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <Bug className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h4 className="font-bold text-yellow-900 mb-1">ಕೀಟ ಪತ್ತೆಯಾಗಿದೆ</h4>
                        <p className="text-yellow-800">{data.pest}</p>
                    </div>
                </div>
            )}

            {/* Deficiency Alert */}
            {data.deficiency && typeof data.deficiency === 'string' && data.deficiency.toLowerCase() !== 'none' && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-start gap-3">
                    <Droplet className="text-orange-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h4 className="font-bold text-orange-900 mb-1">ಪೋಷಕಾಂಶ ಕೊರತೆ</h4>
                        <p className="text-orange-800">{data.deficiency}</p>
                    </div>
                </div>
            )}

            {/* Symptoms - Expandable */}
            {data.symptoms && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100">
                    <button
                        onClick={() => toggleSection('symptoms')}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Activity className="text-blue-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">ಲಕ್ಷಣಗಳು</h3>
                        </div>
                        {expandedSections.symptoms ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    {expandedSections.symptoms && (
                        <div className="px-6 pb-4">
                            <p className="text-gray-700 leading-relaxed">{data.symptoms}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Treatment - Step by Step */}
            {data.treatment && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100">
                    <button
                        onClick={() => toggleSection('treatment')}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">ಚಿಕಿತ್ಸೆ</h3>
                        </div>
                        {expandedSections.treatment ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    {expandedSections.treatment && (
                        <div className="px-6 pb-4">
                            <div className="bg-red-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                    {data.treatment}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Prevention Tips */}
            {data.prevention && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200">
                    <button
                        onClick={() => toggleSection('prevention')}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Shield className="text-green-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು</h3>
                        </div>
                        {expandedSections.prevention ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    {expandedSections.prevention && (
                        <div className="px-6 pb-4">
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                    {data.prevention}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Note */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-800">
                    <strong>ಸೂಚನೆ:</strong> ಈ ವಿಶ್ಲೇಷಣೆ AI ಆಧಾರಿತವಾಗಿದೆ. ಗಂಭೀರ ಸಮಸ್ಯೆಗಳಿಗೆ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.
                </p>
            </div>
        </motion.div>
    );
};

export default DiseaseResult;
