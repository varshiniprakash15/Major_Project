// import React from 'react';
// import { ArrowRight, Tractor, Users, Wrench } from 'lucide-react';

// const DashboardButton = ({ icon: Icon, label, onClick }) => (
//     <button
//         onClick={onClick}
//         className="flex items-center justify-between w-full p-4 text-left text-lg font-semibold text-gray-700 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
//     >
//         <div className="flex items-center">
//             <Icon className="w-8 h-8 mr-3 text-blue-500" />
//             <span>{label}</span>
//         </div>
//         <ArrowRight className="w-6 h-6 text-gray-400" />
//     </button>
// );

// const DashboardSelection = ({ onSelect }) => {
//     const handleSelection = (dashboardType) => {
//         onSelect(dashboardType);
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md mx-auto">
//                 <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
//                     Select Your Dashboard
//                 </h2>
//                 <div className="space-y-4">
//                     <DashboardButton
//                         icon={Tractor}
//                         label="Farm Owner Dashboard"
//                         onClick={() => handleSelection('farmOwner')}
//                     />
//                     <DashboardButton
//                         icon={Users}
//                         label="Labor Dashboard"
//                         onClick={() => handleSelection('labor')}
//                     />
//                     <DashboardButton
//                         icon={Wrench}
//                         label="Service Provider Dashboard"
//                         onClick={() => handleSelection('serviceProvider')}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DashboardSelection;


"use client"

import React from 'react';
import { ArrowRight, Tractor, Users, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardButton = ({ icon: Icon, label, onClick }) => (
    <motion.button
        onClick={onClick}
        className="flex items-center justify-between w-full p-6 text-left text-xl font-semibold text-green-800 bg-white rounded-xl shadow-lg hover:bg-green-50 transition-colors duration-200"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="flex items-center">
            <Icon className="w-10 h-10 mr-4 text-green-600" />
            <span>{label}</span>
        </div>
        <ArrowRight className="w-6 h-6 text-green-500" />
    </motion.button>
);

const DashboardSelection = ({ onSelect }) => {
    const handleSelection = (dashboardType) => {
        onSelect(dashboardType);
    };

    return (
        <div className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
            style={{ backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Agricultural+Field+Background')" }}
        >
            <div className="max-w-md w-full space-y-8 bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl backdrop-blur-sm">
                <div>
                    <h2 className="mt-6 text-center text-4xl font-extrabold text-green-800 mb-2">
                        Welcome to Farm Unity
                    </h2>
                    <p className="text-center text-xl text-green-600 mb-8">
                        Select Your Dashboard
                    </p>
                </div>
                <div className="space-y-6">
                    <DashboardButton
                        icon={Tractor}
                        label="Farm Owner Dashboard"
                        onClick={() => handleSelection('farmOwner')}
                    />
                    <DashboardButton
                        icon={Users}
                        label="Labor Dashboard"
                        onClick={() => handleSelection('labor')}
                    />
                    <DashboardButton
                        icon={Wrench}
                        label="Service Provider Dashboard"
                        onClick={() => handleSelection('serviceProvider')}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardSelection;

