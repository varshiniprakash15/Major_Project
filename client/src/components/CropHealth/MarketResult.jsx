import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, TrendingDown, Minus, MapPin, Award, 
    IndianRupee, Calendar, Lightbulb, Package, 
    ChevronDown, ChevronUp, Printer, Share2, Info
} from 'lucide-react';

const MarketResult = ({ data }) => {
    const [expandedSections, setExpandedSections] = useState({
        tips: false,
        selling: false,
        storage: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getGradeColor = (grade) => {
        if (grade === 'A') return 'bg-green-100 text-green-800 border-green-300';
        if (grade === 'B') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        if (grade === 'C') return 'bg-red-100 text-red-800 border-red-300';
        return 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getDemandMeter = (demand) => {
        const levels = {
            'very_high': { width: '100%', color: 'bg-green-500', text: 'ಅತಿ ಹೆಚ್ಚು' },
            'high': { width: '80%', color: 'bg-blue-500', text: 'ಹೆಚ್ಚು' },
            'medium': { width: '60%', color: 'bg-yellow-500', text: 'ಮಧ್ಯಮ' },
            'low': { width: '40%', color: 'bg-orange-500', text: 'ಕಡಿಮೆ' },
            'very_low': { width: '20%', color: 'bg-red-500', text: 'ಅತಿ ಕಡಿಮೆ' }
        };
        return levels[demand] || levels.medium;
    };

    const getPriceTrendIcon = (trend) => {
        if (trend?.toLowerCase().includes('rising')) return <TrendingUp className="text-green-600" size={40} />;
        if (trend?.toLowerCase().includes('falling')) return <TrendingDown className="text-red-600" size={40} />;
        return <Minus className="text-gray-600" size={40} />;
    };

    const handlePrint = () => window.print();
    
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ',
                    text: `${data.crop_type} - ₹${data.average_market_price}`,
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        }
    };

    const demandMeter = getDemandMeter(data.market_demand);

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
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ</h2>
                        <p className="text-xl opacity-90">{data.crop_type}</p>
                        {data.variety && <p className="text-sm opacity-75">({data.variety})</p>}
                    </div>
                    {data.quality_grade && (
                        <div className={`px-6 py-3 rounded-full border-2 font-bold text-2xl ${getGradeColor(data.quality_grade)}`}>
                            {data.quality_grade} ದರ್ಜೆ
                        </div>
                    )}
                </div>
            </div>

            {/* Price Section - Hero Display */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center">
                    <p className="text-sm opacity-80 mb-2">ಸರಾಸರಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <IndianRupee size={48} strokeWidth={3} />
                        <p className="text-6xl font-bold">{data.average_market_price}</p>
                    </div>
                    {(data.estimated_price_min && data.estimated_price_max) && (
                        <p className="text-lg opacity-90">
                            ಬೆಲೆ ವ್ಯಾಪ್ತಿ: ₹{data.estimated_price_min} - ₹{data.estimated_price_max}
                        </p>
                    )}
                </div>
            </div>

            {/* Market Demand Meter */}
            {data.market_demand && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ</h3>
                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">ಬೇಡಿಕೆ ಮಟ್ಟ</span>
                            <span className="font-semibold text-gray-900">{demandMeter.text}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: demandMeter.width }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-6 ${demandMeter.color} flex items-center justify-end pr-2`}
                            >
                                <span className="text-white text-xs font-bold">{demandMeter.width}</span>
                            </motion.div>
                        </div>
                    </div>
                    {data.demand_reason && (
                        <div className="bg-blue-50 rounded-lg p-4 mt-4">
                            <p className="text-sm text-blue-900">
                                <strong>ಕಾರಣ:</strong> {data.demand_reason}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Season */}
                {data.season && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="text-amber-600" size={24} />
                            <h3 className="text-lg font-bold text-amber-900">ಋತು</h3>
                        </div>
                        <p className="text-amber-800 text-lg font-semibold">{data.season}</p>
                    </div>
                )}

                {/* Best Selling Time */}
                {data.best_selling_time && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="text-green-600" size={24} />
                            <h3 className="text-lg font-bold text-green-900">ಉತ್ತಮ ಮಾರಾಟ ಸಮಯ</h3>
                        </div>
                        <p className="text-green-800 text-lg font-semibold">{data.best_selling_time}</p>
                    </div>
                )}
            </div>

            {/* Major Markets */}
            {data.major_markets && data.major_markets.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="text-purple-600" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆಗಳು</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {data.major_markets.map((market, index) => (
                            <div key={index} className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                                <MapPin size={16} className="text-purple-600" />
                                <span className="text-purple-900 font-medium">{market}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Trend */}
            {data.price_trend && (
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">ಬೆಲೆ ಪ್ರವೃತ್ತಿ</h3>
                            <p className="text-2xl font-bold text-gray-800">{data.price_trend}</p>
                        </div>
                        <div>
                            {getPriceTrendIcon(data.price_trend)}
                        </div>
                    </div>
                </div>
            )}

            {/* Quality Improvement Tips - Expandable */}
            {data.quality_improvement_tips && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-200">
                    <button
                        onClick={() => toggleSection('tips')}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Award className="text-blue-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">ಗುಣಮಟ್ಟ ಸುಧಾರಣೆ ಸಲಹೆಗಳು</h3>
                        </div>
                        {expandedSections.tips ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    {expandedSections.tips && (
                        <div className="px-6 pb-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{data.quality_improvement_tips}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Selling Tips - Expandable */}
            {data.selling_tips && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200">
                    <button
                        onClick={() => toggleSection('selling')}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Lightbulb className="text-green-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">ಮಾರಾಟ ಸಲಹೆಗಳು</h3>
                        </div>
                        {expandedSections.selling ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    {expandedSections.selling && (
                        <div className="px-6 pb-4">
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{data.selling_tips}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Storage Advice - Expandable */}
            {data.storage_advice && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-200">
                    <button
                        onClick={() => toggleSection('storage')}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-orange-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Package className="text-orange-600" size={24} />
                            <h3 className="text-lg font-bold text-gray-900">ಸಂಗ್ರಹ ಸಲಹೆ</h3>
                        </div>
                        {expandedSections.storage ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    
                    {expandedSections.storage && (
                        <div className="px-6 pb-4">
                            <div className="bg-orange-50 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{data.storage_advice}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Note */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
                <Info className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-800">
                    <strong>ಸೂಚನೆ:</strong> ಬೆಲೆಗಳು ಮಾರುಕಟ್ಟೆ ಪರಿಸ್ಥಿತಿಗಳ ಆಧಾರದ ಮೇಲೆ ಬದಲಾಗಬಹುದು. ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.
                </p>
            </div>
        </motion.div>
    );
};

export default MarketResult;
