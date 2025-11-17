import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import LoginForm from './components/adharVerify/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import RoleSelection from './components/RoleSelection';
import ProfileCompletion from './components/ProfileCompletion';
import DashboardSelection from './components/DashboardSelection';
import FarmerDashboard from './components/FarmerDashboard/Dashboard';
import EnhancedFarmerDashboard from './components/FarmerDashboard/EnhancedDashboard';
import LaborDashboard from './components/FarmerDashboard/LabourDashboard';
import EnhancedLaborerDashboard from './components/LaborerDashboard/EnhancedLaborerDashboard';
import ServiceProviderDashboard from './components/FarmerDashboard/ServiceProviderDashboard';
import EnhancedServiceProviderDashboard from './components/ServiceProviderDashboard/EnhancedServiceProviderDashboard';

function App() {
  const [userState, setUserState] = useState('animation');
  const [dashboardType, setDashboardType] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setUserState('deviceSelection');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeviceSelection = (isSmartphone) => {
    setUserState(isSmartphone ? 'initial' : 'desktopRedirect');
  };

  const handleNewUserSignup = () => {
    setUserState('registering');
  };

  const sendServices = useCallback((newServices) => {
    setServices(newServices);
  }, []);

  const handleUserAuthenticated = (user) => {
    setCurrentUser(user);
    if (user.isProfileComplete) {
      setUserState('dashboardSelection');
    } else {
      setUserState('roleSelection');
    }
  };

  const handleRegistrationComplete = (user) => {
    setCurrentUser(user);
    setUserState('roleSelection');
  };

  const handleRoleSelected = (role) => {
    setSelectedRole(role);
    // Map role to dashboard type
    const roleToDashboard = {
      'farmer': 'farmOwner',
      'laborer': 'labor',
      'serviceProvider': 'serviceProvider'
    };
    setDashboardType(roleToDashboard[role]);
    setUserState('dashboard'); // Go directly to dashboard
  };

  const handleProfileCompleted = () => {
    setIsProfileComplete(true);
    setUserState('dashboardSelection');
  };

  const handleDashboardSelection = (type) => {
    setDashboardType(type);
    setUserState('dashboard');
  };

  const handleBackToDashboardSelection = () => {
    setUserState('dashboardSelection');
    setDashboardType(null);
  };

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setUserState('initial');
    setDashboardType(null);
    setServices([]);
    setServiceRequests([]);
  }, []);

  const updateServices = useCallback((newServices) => {
    setServices(newServices);
  }, []);

  const requestService = useCallback((serviceId) => {
    const newRequest = {
      id: Date.now(),
      serviceId,
      farmerName: currentUser.name,
      farmerId: currentUser.id,
      date: new Date().toISOString().split('T')[0]
    };
    setServiceRequests(prevRequests => [...prevRequests, newRequest]);
  }, [currentUser]);

  const renderDashboard = () => {
    switch (dashboardType) {
      case 'farmOwner':
        return (
          <EnhancedFarmerDashboard
            onBackClick={handleBackToDashboardSelection}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );
      case 'labor':
        return (
          <EnhancedLaborerDashboard
            onBackClick={handleBackToDashboardSelection}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );
      case 'serviceProvider':
        return (
          <EnhancedServiceProviderDashboard
            onBackClick={handleBackToDashboardSelection}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (userState === 'animation') {
      return (
        <div className="flex items-center justify-center h-screen bg-[#1E212A]">
          <div className={`text-center transition-opacity duration-500 ${animationComplete ? 'opacity-0' : 'opacity-100'}`}>
            <img
              src="/logo.png"
              alt="Farm Unity Logo"
              className="w-40 h-40 mx-auto mb-6 rounded-full animate-bounce"
            />
            <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
              FARM UNITY
            </h1>
            <p className="text-2xl text-white animate-pulse">
              India's Firstever Online Agricultural Open Mobility platform
            </p>
          </div>
        </div>
      );
    }

    if (userState === 'deviceSelection') {
      return (
        <div className="flex items-center justify-center h-screen bg-[#1E212A]">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-8">Are you using a smartphone?</h2>
            <div className="space-x-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDeviceSelection(true)}
              >
                Yes
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDeviceSelection(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (userState === 'desktopRedirect') {
      return (
        <div className="h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
          <div className="bg-white shadow-2xl rounded-xl p-8 text-center max-w-md w-full transform transition duration-500 hover:scale-105">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600 mb-4">
              Call Our Toll-Free Number
            </h1>
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 shadow-md">
              <p className="text-4xl font-bold text-green-700 tracking-wider">
                USD +1 7754589120
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-500 italic">
              24/7 Customer Support
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        {/* Fixed Language Selector */}
        <div className="fixed bottom-4 right-4 z-50">
          <LanguageSelector />
        </div>
        <main>
          {userState === 'initial' && (
            <LoginForm
              onNewUserSignup={handleNewUserSignup}
              onExistingUserLogin={handleUserAuthenticated}
            />
          )}
          {userState === 'registering' && (
            <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
          )}
          {userState === 'roleSelection' && (
            <RoleSelection 
              onRoleSelected={handleRoleSelected}
              userData={currentUser}
            />
          )}
          {userState === 'profileCompletion' && (
            <ProfileCompletion 
              role={selectedRole}
              onProfileComplete={handleProfileCompleted}
            />
          )}
          {userState === 'dashboardSelection' && (
            <DashboardSelection onSelect={handleDashboardSelection} />
          )}
          {userState === 'dashboard' && renderDashboard()}
        </main>
      </div>
    );
  };

  return (
    <LanguageProvider>
      <Router>
        {renderContent()}
      </Router>
    </LanguageProvider>
  );
}

export default App;