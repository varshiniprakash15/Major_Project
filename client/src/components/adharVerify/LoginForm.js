import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Sprout, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const API_BASE_URL = 'http://localhost:6002/api';

const LoginForm = ({ onNewUserSignup, onExistingUserLogin }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [pin, setPin] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [isPinSent, setIsPinSent] = useState(false);
    const [isForgotPin, setIsForgotPin] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const [generatedPin, setGeneratedPin] = useState('');

    const sendPin = async (forgotPin = false) => {
        if (!mobileNumber) {
            toast.error(t('auth.enterMobileNumber'));
            return;
        }

        const cleanedNumber = mobileNumber.replace(/\D/g, '');

        if (cleanedNumber.length !== 10) {
            toast.error(t('auth.enterMobileNumber'));
            return;
        }

        setIsLoading(true);
        try {
            let endpoint = forgotPin ? `${API_BASE_URL}/forgot-pin` : `${API_BASE_URL}/send-pin`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobileNumber: cleanedNumber }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send PIN');
            }

            // Store the generated PIN for display
            if (data.pin) {
                setGeneratedPin(data.pin);
                setPin(data.pin); // Auto-fill the PIN field
            }

            // Show different messages based on development mode
            if (data.developmentMode) {
                toast.success(`${t('auth.developmentMode')}: ${data.pin}`);
            } else {
                toast.success(t('auth.pinSent'));
            }

            setIsPinSent(true);
            if (forgotPin) {
                setIsForgotPin(false);
            }
        } catch (error) {
            console.error('Error sending PIN:', error);
            toast.error(error.message || t('errors.serverError'));
        } finally {
            setIsLoading(false);
        }
    };
    const handleForgotPin = () => {
        setIsForgotPin(true);
        setIsPinSent(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mobileNumber || !pin) {
            toast.error(
                '• कृपया मोबाइल नंबर और पिन दर्ज करें\n' +
                '• ದಯವಿಟ್ಟು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಪಿನ್ ನಮೂದಿಸಿ\n' +
                '• Please enter mobile number and PIN'
            );
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE_URL}/login`, { mobileNumber, pin });

            localStorage.setItem('token', data.token);
            toast.success(
                '• लॉगिन सफल!\n' +
                '• ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!\n' +
                '• Login successful!'
            );

            onExistingUserLogin(data.user);
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                const { message } = error.response.data;

                if (message === 'Invalid credentials') {
                    toast.error(
                        '• अमान्य क्रेडेंशियल्स। कृपया पुनः प्रयास करें।\n' +
                        '• ಅಮಾನ್ಯ ಪರಿಚಯಪತ್ರಗಳು. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\n' +
                        '• Invalid credentials. Please try again.'
                    );
                } else {
                    toast.error(
                        '• लॉगिन में त्रुटि। कृपया पुनः प्रयास करें।\n' +
                        '• ಲಾಗಿನ್ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\n' +
                        '• Login error. Please try again.'
                    );
                }
            } else {
                toast.error(
                    '• सर्वर से कनेक्ट करने में समस्या। कृपया पुनः प्रयास करें।\n' +
                    '• ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ತೊಂದರೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\n' +
                    '• Problem connecting to the server. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isPinSent) {
            toast.error(
                '• कृपया पहले पिन का अनुरोध करें\n' +
                '• ದಯವಿಟ್ಟು ಮೊದಲು ಪಿನ್ ಕೋರಿ\n' +
                '• Please request PIN first'
            );
            return;
        }
        if (pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
            toast.error(
                '• पिन 4-6 अंकों का होना चाहिए\n' +
                '• ಪಿನ್ 4-6 ಅಂಕೆಗಳಾಗಿರಬೇಕು\n' +
                '• PIN must be 4-6 digits'
            );
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, mobileNumber, aadharNumber, pin }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            toast.success(
                '• पंजीकरण सफल!\n' +
                '• ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!\n' +
                '• Registration successful!'
            );
            onNewUserSignup({
                id: data.userId,
                name: name,
                mobileNumber: mobileNumber,
                role: 'unregistered',
                isProfileComplete: false
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error(
                error.message ||
                '• पंजीकरण में त्रुटि। कृपया पुनः प्रयास करें।\n' +
                '• ನೋಂದಣಿಯಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\n' +
                '• Error in registration. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPinSubmit = async (e) => {
        e.preventDefault();
        if (!isPinSent) {
            toast.error(
                '• कृपया पहले नया पिन का अनुरोध करें\n' +
                '• ದಯವಿಟ್ಟು ಮೊದಲು ಹೊಸ ಪಿನ್ ಕೋರಿ\n' +
                '• Please request a new PIN first'
            );
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/forgot-pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobileNumber }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }

            toast.success(
                '• नया पिन आपके मोबाइल नंबर पर भेजा गया है\n' +
                '• ಹೊಸ ಪಿನ್ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ\n' +
                '• New PIN has been sent to your mobile number!'
            );
            setIsForgotPin(false);
            setActiveTab('login');
            setPin(''); // Clear the PIN input
        } catch (error) {
            console.error('Error:', error);
            toast.error(
                error.message ||
                '• पिन रीसेट में त्रुटि। कृपया पुनः प्रयास करें।\n' +
                '• ಪಿನ್ ಮರುಹೊಂದಿಸುವಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\n' +
                '• Error resetting PIN. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-600 p-3 rounded-full">
                            <Sprout className="h-12 w-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-green-800">Farm Unity</h2>
                    <p className="text-center text-lg text-green-600">किसान मित्र पोर्टल</p>
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-2 px-4 text-center ${activeTab === 'login' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('login')}
                        >
                            {t('auth.login')}
                        </button>
                        <button
                            className={`flex-1 py-2 px-4 text-center ${activeTab === 'register' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('register')}
                        >
                            {t('auth.register')}
                        </button>
                    </div>
                    {activeTab === 'login' && !isForgotPin && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="tel"
                                placeholder={t('auth.mobileNumber')}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border
-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="password"
                                placeholder={t('auth.enterPin')}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                )}
                                {t('auth.login')}
                            </button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-green-600 hover:underline focus:outline-none"
                                    onClick={handleForgotPin}
                                >
                                    {t('auth.forgotPin')}
                                </button>
                            </div>
                        </form>
                    )}
                    {activeTab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <input
                                type="text"
                                placeholder="किसान का नाम / Farmer Name/ರೈತರ ಹೆಸರು"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="tel"
                                placeholder="मोबाइल नंबर / Mobile Number/ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="text"
                                placeholder="आधार नंबर / Aadhaar Number/ಆಧಾರ್ ಸಂಖ್ಯೆ "
                                value={aadharNumber}
                                onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                maxLength={12}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="password"
                                placeholder="4-6 अंकों का पिन / 4-6 digit PIN/ 4-6 ಅಂಕೆಗಳ ಪಿನ್ "
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => sendPin()}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                disabled={isLoading || isPinSent}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                )}
                                {isPinSent ? t('auth.pinSent') : t('auth.sendPin')}
                            </button>
                            {isPinSent && generatedPin && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-center">
                                    <p className="text-sm text-yellow-800 font-medium">
                                        {t('auth.developmentMode')} - {t('auth.generatedPin')}:
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-900 mt-1">
                                        {generatedPin}
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        विकास मोड - इस पिन का उपयोग करें / ಅಭಿವೃದ್ಧಿ ಮೋಡ್ - ಈ ಪಿನ್ ಬಳಸಿ
                                    </p>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                disabled={isLoading || !isPinSent}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <UserPlus className="mr-2 h-4 w-4" />
                                )}
                                {t('auth.register')}
                            </button>
                        </form>
                    )}
                    {isForgotPin && (
                        <form onSubmit={handleForgotPinSubmit} className="space-y-4">
                            <input
                                type="tel"
                                placeholder="मोबाइल नंबर / Mobile Number/ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ "
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => sendPin(true)}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                disabled={isLoading || isPinSent}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                )}
                                {isPinSent ? t('auth.pinSent') : t('auth.sendPin')}
                            </button>
                            {isPinSent && generatedPin && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-center">
                                    <p className="text-sm text-yellow-800 font-medium">
                                        {t('auth.developmentMode')} - {t('auth.generatedPin')}:
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-900 mt-1">
                                        {generatedPin}
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        विकास मोड - इस पिन का उपयोग करें / ಅಭಿವೃದ್ಧಿ ಮೋಡ್ - ಈ ಪಿನ್ ಬಳಸಿ
                                    </p>
                                </div>
                            )}
                            {isPinSent && (
                                <>
                                    <input
                                        type="password"
                                        placeholder={t('auth.enterPin')}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                        )}
                                        {t('auth.verifyPin')}
                                    </button>
                                </>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;


