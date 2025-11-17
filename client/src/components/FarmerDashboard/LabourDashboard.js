import React, { useState, useEffect } from 'react';
import { User, Calendar, Briefcase, DollarSign, Clock, MapPin, Phone, Mail, HelpCircle, LogOut, ArrowLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const LaborDashboard = ({ onBackClick, onLogout }) => {
    // Skills dictionary with multilingual support
    const skillsDict = {
        english: [
            'Harvesting', 'Planting', 'Irrigation',
            'Weeding', 'Crop Monitoring', 'Fertilizing',
            'Soil Preparation', 'Pruning', 'Pest Control'
        ],
        kannada: [
            'ಬೆಳೆ ಕೊಯ್ಯುವಿಕೆ', 'ಬೀಜ ಬಿತ್ತನೆ', 'ನೀರಾವರಿ',
            'ಕಳೆ ಹೋಗಿಸುವಿಕೆ', 'ಬೆಳೆ ಮೇಲ್ವಿಚಾರಣೆ', 'ರಸಧಾನ್ಯ ಹಾಕುವಿಕೆ',
            'ಮಣ್ಣಿನ ಸಿದ್ಧತೆ', 'ಕಟ್ಟಿಗೆ ಕಟ್ಟುವಿಕೆ', 'ಕೀಟನಾಶಕ ನಿಯಂತ್ರಣ'
        ],
        hindi: [
            'फसल कटाई', 'बीज बोना', 'सिंचाई',
            'खरपतवार निकालना', 'फसल निगरानी', 'उर्वरक लगाना',
            'मिट्टी की तैयारी', 'काटछांट', 'कीट नियंत्रण'
        ]
    };

    const [currentPage, setCurrentPage] = useState('profile');
    const [laborProfile, setLaborProfile] = useState({
        name: 'Rahul Kumar',
        skill: 'Harvesting',
        experience: '5 years',
        dailyWage: '₹500',
        location: 'Tumkur, Karnataka',
        phone: '+91 9876543210',
        email: 'rahul.kumar@example.com'
    });

    // New state for managing labor services with language support
    const [language, setLanguage] = useState('english');
    const [laborServices, setLaborServices] = useState([]);
    const [newService, setNewService] = useState({
        name: '',
        amount: '',
        mobileNumber: '',
        dateL: '',
        skills: ''
    });
    const [upcomingJobs] = useState([
        { id: 1, date: '2024-09-05', farmer: 'John Smith', location: 'Field A', duration: '8 hours' },
        { id: 2, date: '2024-09-10', farmer: 'Emily Brown', location: 'Orchard B', duration: '6 hours' },
    ]);

    const menuItems = [
        { icon: <User className="w-5 h-5 mr-3" />, text: "My Profile", page: 'profile' },
        { icon: <Calendar className="w-5 h-5 mr-3" />, text: "My Calendar", page: 'calendar' },
        { icon: <Briefcase className="w-5 h-5 mr-3" />, text: "My Services", page: 'services' },
        { icon: <Briefcase className="w-5 h-5 mr-3" />, text: "Job History", page: 'jobHistory' },
        { icon: <DollarSign className="w-5 h-5 mr-3" />, text: "Earnings", page: 'earnings' },
        { icon: <HelpCircle className="w-5 h-5 mr-3" />, text: "Help & Support", page: 'support' },
        { icon: <LogOut className="w-5 h-5 mr-3" />, text: "Logout", page: 'logout' },
    ];

    useEffect(() => {
        if (currentPage === 'logout') {
            handleLogout();
        }
        if (currentPage === 'services') {
            fetchServices();
        }
    }, [currentPage]);

    // Fetch labor services from the database
    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:6002/api/my-laborer-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.laborer) {
                // Convert laborer profile to service format for display
                const laborer = response.data.laborer;
                const services = [{
                    _id: laborer._id,
                    name: laborer.name,
                    amount: laborer.workDetails?.dailyWage || 500,
                    mobileNumber: laborer.mobileNumber,
                    skills: laborer.skills?.primarySkills?.join(', ') || 'General Labor'
                }];
                setLaborServices(services);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Handle adding new labor service (updating profile)
    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch('http://localhost:6002/api/laborer', {
                workType: newService.skills,
                dailyWage: parseInt(newService.amount),
                mobileNumber: newService.mobileNumber,
                availability: 'available',
                skills: [newService.skills]
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.laborer) {
                // Update local state with new profile data
                const laborer = response.data.laborer;
                const services = [{
                    _id: laborer._id,
                    name: laborer.name,
                    amount: laborer.workDetails?.dailyWage || 500,
                    mobileNumber: laborer.mobileNumber,
                    skills: laborer.skills?.primarySkills?.join(', ') || 'General Labor'
                }];
                setLaborServices(services);
                setNewService({ name: '', amount: '', mobileNumber: '', date: '', skills: '' });
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLaborProfile(null);
            onLogout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Updated renderServices with language dropdown for skills
    const renderServices = () => (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
            <h2 className="text-3xl font-bold mb-6 text-green-800">My Services</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Language for Skills
                </label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="english">English</option>
                    <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="hindi">हिन्दी (Hindi)</option>
                </select>
            </div>

            <form onSubmit={handleAddService} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Labour Name"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Daily Rate (₹)"
                        value={newService.amount}
                        onChange={(e) => setNewService({ ...newService, amount: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={newService.mobileNumber}
                        onChange={(e) => setNewService({ ...newService, mobileNumber: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <select
                        value={newService.skills}
                        onChange={(e) => setNewService({ ...newService, skills: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    >
                        <option value="">Select Skill</option>
                        {skillsDict[language].map((skill, index) => (
                            <option key={index} value={skill}>{skill}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md">
                    Add Service
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-green-700">Registered Services</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-green-200 rounded-lg overflow-hidden">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Service</th>
                                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Daily Rate</th>
                                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Skills</th>
                                <th className="py-3 px-4 border-b text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {laborServices.map((service, index) => (
                                <tr key={service._id || index} className="hover:bg-green-50 transition-colors duration-200">
                                    <td className="py-4 px-4 border-b">{service.name}</td>
                                    <td className="py-4 px-4 border-b">₹{service.amount}</td>
                                    <td className="py-4 px-4 border-b">{service.skills}</td>
                                    <td className="py-4 px-4 border-b">{service.mobileNumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Rest of the component remains the same as in the original code
    const renderProfile = () => (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                    <User className="w-6 h-6 mr-2 text-gray-600" />
                    <p><span className="font-semibold">Name:</span> {laborProfile.name}</p>
                </div>
                <div className="flex items-center">
                    <Briefcase className="w-6 h-6 mr-2 text-gray-600" />
                    <p><span className="font-semibold">Skill:</span> {laborProfile.skill}</p>
                </div>

            </div>
        </div>
    );


    const renderCalendar = () => (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
            <h2 className="text-3xl font-bold mb-6 text-green-800">My Calendar</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-green-100">
                        <tr>
                            <th className="py-3 px-4 border-b-2 border-green-200 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Date</th>
                            <th className="py-3 px-4 border-b-2 border-green-200 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Farmer</th>
                            <th className="py-3 px-4 border-b-2 border-green-200 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Location</th>
                            <th className="py-3 px-4 border-b-2 border-green-200 text-left text-xs font-semibold text-green-600 uppercase tracking-wider">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-green-50 transition-colors duration-200">
                                <td className="py-4 px-4 border-b border-green-100">{job.date}</td>
                                <td className="py-4 px-4 border-b border-green-100">{job.farmer}</td>
                                <td className="py-4 px-4 border-b border-green-100">{job.location}</td>
                                <td className="py-4 px-4 border-b border-green-100">{job.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    const renderJobHistory = () => (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
            <h2 className="text-3xl font-bold mb-6 text-green-800">Job History</h2>
            <ul className="space-y-4">
                {['Harvesting - Farm A', 'Planting - Farm B', 'Irrigation - Farm C'].map((job, index) => (
                    <li key={index} className="bg-green-50 p-4 rounded-lg flex items-center">
                        <Briefcase className="w-6 h-6 text-green-600 mr-4" />
                        <span>{job} (Completed)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
    const renderEarnings = () => (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
            <h2 className="text-3xl font-bold mb-6 text-green-800">Earnings</h2>
            <div className="bg-green-50 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold text-green-700">₹15,000</p>
                <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
            </div>
        </div>
    );

    const renderSupport = () => (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
            <h2 className="text-3xl font-bold mb-6 text-green-800">Help & Support</h2>
            <div className="bg-green-50 p-6 rounded-lg">
                <HelpCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-center">If you need any assistance, please contact our support team at support@farmunity.com</p>
            </div>
        </div>
    );
    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Earnings Card - More Prominent */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-xl transform transition-all hover:scale-105 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <DollarSign className="w-10 h-10 text-white opacity-70" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Last 30 Days</span>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold">₹15,000</p>
                        <p className="text-sm opacity-80 mt-2">Total Earnings</p>
                    </div>
                </div>

                {/* Available Jobs Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-emerald-800">Available Jobs</h3>
                        <ChevronRight className="w-6 h-6 text-emerald-600" />
                    </div>
                    <ul className="space-y-3">
                        {['Harvesting - Farm A', 'Planting - Farm B', 'Irrigation - Farm C'].map((job, index) => (
                            <li key={index} className="bg-emerald-50 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <Briefcase className="w-5 h-5 text-emerald-600 mr-3" />
                                    <span className="text-emerald-900">{job}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-emerald-500" />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* My Schedule Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-emerald-800">My Schedule</h3>
                        <Calendar className="w-6 h-6 text-emerald-600" />
                    </div>
                    <ul className="space-y-3">
                        {[
                            { day: 'Monday', task: 'Farm A - Harvesting', time: '8am - 4pm' },
                            { day: 'Wednesday', task: 'Farm B - Planting', time: '9am - 3pm' },
                            { day: 'Friday', task: 'Farm C - Irrigation', time: '10am - 2pm' }
                        ].map((schedule, index) => (
                            <li key={index} className="bg-emerald-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-emerald-700 block">{schedule.day}</span>
                                        <span className="text-sm text-emerald-600">{schedule.task}</span>
                                    </div>
                                    <span className="text-sm text-emerald-500 font-medium">{schedule.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                    <Briefcase className="w-10 h-10 mx-auto text-emerald-600 mb-4" />
                    <p className="text-2xl font-bold text-emerald-800">24</p>
                    <p className="text-sm text-gray-600">Total Jobs Completed</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                    <User className="w-10 h-10 mx-auto text-emerald-600 mb-4" />
                    <p className="text-2xl font-bold text-emerald-800">5+</p>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300">
                    <MapPin className="w-10 h-10 mx-auto text-emerald-600 mb-4" />
                    <p className="text-2xl font-bold text-emerald-800">3</p>
                    <p className="text-sm text-gray-600">Active Regions</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Modern, Sleek Design */}
            <div className="w-72 bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-pattern"></div>
                <div className="p-6 relative z-10">
                    {/* Profile Header */}
                    <div className="flex items-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl">{laborProfile?.name || 'Guest'}</h2>
                            <p className="text-sm text-emerald-200">Laborer ID: L12345</p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        {menuItems.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    flex items-center py-3 px-4 rounded-lg cursor-pointer 
                                    transition-all duration-300 
                                    ${currentPage === item.page
                                        ? 'bg-white/20 text-white'
                                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                                    }
                                `}
                                onClick={() => setCurrentPage(item.page)}
                            >
                                {item.icon}
                                <span className="font-medium">{item.text}</span>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-5 px-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-emerald-800">Labor Dashboard</h1>
                        <button
                            onClick={onBackClick}
                            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {currentPage === 'dashboard' && renderDashboard()}
                        {currentPage === 'profile' && renderProfile()}
                        {currentPage === 'calendar' && renderCalendar()}
                        {currentPage === 'services' && renderServices()}
                        {currentPage === 'jobHistory' && renderJobHistory()}
                        {currentPage === 'earnings' && renderEarnings()}
                        {currentPage === 'support' && renderSupport()}
                    </div>
                </main>
            </div>

            {/* Custom CSS for background pattern */}
            <style jsx>{`
                .bg-pattern {
                    background-image: 
                        linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
                        linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                }
            `}</style>
        </div>
    );
};

export default LaborDashboard;