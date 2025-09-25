const mongoose = require('mongoose');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
const Laborer = require('./models/Laborer');
const ServiceProvider = require('./models/ServiceProvider');
require('dotenv').config();

const createDummyAccounts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/agrolink');
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Farmer.deleteMany({});
        await Laborer.deleteMany({});
        await ServiceProvider.deleteMany({});
        console.log('Cleared existing data');

        const dummyAccounts = [];

        // Create Farmers
        const farmers = [
            {
                user: {
                    name: "Rajesh Kumar",
                    mobileNumber: "9876543210",
                    aadharNumber: "123456789012",
                    pin: "1234",
                    role: "farmer"
                },
                farmer: {
                    location: {
                        address: "Village: Ramnagar, Block: Gaya",
                        pincode: "823001",
                        state: "Bihar",
                        district: "Gaya",
                        coordinates: { latitude: 24.7964, longitude: 85.0000 }
                    },
                    farmDetails: {
                        farmType: "crop",
                        farmSize: 5.5,
                        crops: ["wheat", "rice", "maize"],
                        irrigationType: "drip"
                    },
                    preferences: {
                        preferredLaborTypes: ["harvesting", "plowing"],
                        maxWage: 500,
                        preferredServiceTypes: ["irrigation", "soil_testing"]
                    },
                    contactInfo: {
                        email: "rajesh.kumar@email.com",
                        alternateMobile: "9876543211",
                        emergencyContact: "9876543212"
                    }
                }
            },
            {
                user: {
                    name: "Priya Sharma",
                    mobileNumber: "9876543213",
                    aadharNumber: "123456789013",
                    pin: "1234",
                    role: "farmer"
                },
                farmer: {
                    location: {
                        address: "Village: Shyamnagar, Block: Patna",
                        pincode: "800001",
                        state: "Bihar",
                        district: "Patna",
                        coordinates: { latitude: 25.5941, longitude: 85.1376 }
                    },
                    farmDetails: {
                        farmType: "dairy",
                        farmSize: 3.2,
                        crops: ["fodder", "maize"],
                        irrigationType: "sprinkler"
                    },
                    preferences: {
                        preferredLaborTypes: ["feeding", "milking"],
                        maxWage: 400,
                        preferredServiceTypes: ["veterinary", "machinery"]
                    },
                    contactInfo: {
                        email: "priya.sharma@email.com",
                        alternateMobile: "9876543214",
                        emergencyContact: "9876543215"
                    }
                }
            },
            {
                user: {
                    name: "Amit Singh",
                    mobileNumber: "9876543216",
                    aadharNumber: "123456789014",
                    pin: "1234",
                    role: "farmer"
                },
                farmer: {
                    location: {
                        address: "Village: Krishnanagar, Block: Muzaffarpur",
                        pincode: "842001",
                        state: "Bihar",
                        district: "Muzaffarpur",
                        coordinates: { latitude: 26.1209, longitude: 85.3647 }
                    },
                    farmDetails: {
                        farmType: "horticulture",
                        farmSize: 2.8,
                        crops: ["mango", "banana", "guava"],
                        irrigationType: "drip"
                    },
                    preferences: {
                        preferredLaborTypes: ["pruning", "harvesting"],
                        maxWage: 600,
                        preferredServiceTypes: ["pest_control", "consultation"]
                    },
                    contactInfo: {
                        email: "amit.singh@email.com",
                        alternateMobile: "9876543217",
                        emergencyContact: "9876543218"
                    }
                }
            }
        ];

        // Create Laborers
        const laborers = [
            {
                user: {
                    name: "Suresh Yadav",
                    mobileNumber: "9876543220",
                    aadharNumber: "123456789020",
                    pin: "1234",
                    role: "laborer"
                },
                laborer: {
                    location: {
                        address: "Village: Yadavnagar, Block: Gaya",
                        pincode: "823002",
                        state: "Bihar",
                        district: "Gaya",
                        coordinates: { latitude: 24.7964, longitude: 85.0000 }
                    },
                    skills: {
                        primarySkills: ["harvesting", "plowing", "seeding"],
                        additionalSkills: ["irrigation", "fertilizing"],
                        experience: 8,
                        certifications: ["Agricultural Worker Certificate"]
                    },
                    workDetails: {
                        dailyWage: 450,
                        preferredWorkTypes: ["harvesting", "plowing", "seeding"],
                        availability: "available",
                        workRadius: 30,
                        preferredTimings: {
                            startTime: "06:00",
                            endTime: "18:00",
                            workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
                        }
                    },
                    contactInfo: {
                        email: "suresh.yadav@email.com",
                        alternateMobile: "9876543221",
                        emergencyContact: "9876543222"
                    }
                }
            },
            {
                user: {
                    name: "Meera Devi",
                    mobileNumber: "9876543223",
                    aadharNumber: "123456789021",
                    pin: "1234",
                    role: "laborer"
                },
                laborer: {
                    location: {
                        address: "Village: Devinagar, Block: Patna",
                        pincode: "800002",
                        state: "Bihar",
                        district: "Patna",
                        coordinates: { latitude: 25.5941, longitude: 85.1376 }
                    },
                    skills: {
                        primarySkills: ["weeding", "planting", "irrigation"],
                        additionalSkills: ["harvesting", "fertilizing"],
                        experience: 5,
                        certifications: ["Women Agricultural Worker Certificate"]
                    },
                    workDetails: {
                        dailyWage: 400,
                        preferredWorkTypes: ["weeding", "planting", "irrigation"],
                        availability: "available",
                        workRadius: 25,
                        preferredTimings: {
                            startTime: "07:00",
                            endTime: "17:00",
                            workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
                        }
                    },
                    contactInfo: {
                        email: "meera.devi@email.com",
                        alternateMobile: "9876543224",
                        emergencyContact: "9876543225"
                    }
                }
            },
            {
                user: {
                    name: "Ramesh Kumar",
                    mobileNumber: "9876543226",
                    aadharNumber: "123456789022",
                    pin: "1234",
                    role: "laborer"
                },
                laborer: {
                    location: {
                        address: "Village: Kumarganj, Block: Muzaffarpur",
                        pincode: "842002",
                        state: "Bihar",
                        district: "Muzaffarpur",
                        coordinates: { latitude: 26.1209, longitude: 85.3647 }
                    },
                    skills: {
                        primarySkills: ["pruning", "harvesting", "fertilizing"],
                        additionalSkills: ["irrigation", "pest_control"],
                        experience: 12,
                        certifications: ["Senior Agricultural Worker", "Pest Control Certificate"]
                    },
                    workDetails: {
                        dailyWage: 550,
                        preferredWorkTypes: ["pruning", "harvesting", "fertilizing"],
                        availability: "available",
                        workRadius: 40,
                        preferredTimings: {
                            startTime: "05:30",
                            endTime: "19:00",
                            workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                        }
                    },
                    contactInfo: {
                        email: "ramesh.kumar@email.com",
                        alternateMobile: "9876543227",
                        emergencyContact: "9876543228"
                    }
                }
            }
        ];

        // Create Service Providers
        const serviceProviders = [
            {
                user: {
                    name: "Vikash Agrotech",
                    mobileNumber: "9876543230",
                    aadharNumber: "123456789030",
                    pin: "1234",
                    role: "serviceProvider"
                },
                serviceProvider: {
                    businessType: "company",
                    location: {
                        address: "Industrial Area, Gaya",
                        pincode: "823003",
                        state: "Bihar",
                        district: "Gaya",
                        coordinates: { latitude: 24.7964, longitude: 85.0000 }
                    },
                    services: [
                        {
                            serviceName: "Drip Irrigation Installation",
                            serviceType: "irrigation",
                            description: "Complete drip irrigation system installation and maintenance",
                            basePrice: 15000,
                            pricingType: "per_acre",
                            serviceArea: 100,
                            isActive: true
                        },
                        {
                            serviceName: "Soil Testing",
                            serviceType: "soil_testing",
                            description: "Comprehensive soil analysis and recommendations",
                            basePrice: 2000,
                            pricingType: "per_service",
                            serviceArea: 150,
                            isActive: true
                        }
                    ],
                    contactInfo: {
                        email: "info@vikashagrotech.com",
                        alternateMobile: "9876543231",
                        emergencyContact: "9876543232",
                        website: "www.vikashagrotech.com"
                    },
                    certifications: ["ISO 9001:2015", "Agricultural Service Provider License"],
                    licenses: ["Trade License", "GST Registration"]
                }
            },
            {
                user: {
                    name: "Dr. Rajesh Verma",
                    mobileNumber: "9876543233",
                    aadharNumber: "123456789031",
                    pin: "1234",
                    role: "serviceProvider"
                },
                serviceProvider: {
                    businessType: "individual",
                    location: {
                        address: "Agricultural Extension Office, Patna",
                        pincode: "800003",
                        state: "Bihar",
                        district: "Patna",
                        coordinates: { latitude: 25.5941, longitude: 85.1376 }
                    },
                    services: [
                        {
                            serviceName: "Agricultural Consultation",
                            serviceType: "consultation",
                            description: "Expert advice on crop selection, farming techniques, and problem solving",
                            basePrice: 1000,
                            pricingType: "hourly",
                            serviceArea: 200,
                            isActive: true
                        },
                        {
                            serviceName: "Pest Control Services",
                            serviceType: "pest_control",
                            description: "Organic and chemical pest control solutions",
                            basePrice: 5000,
                            pricingType: "per_acre",
                            serviceArea: 100,
                            isActive: true
                        }
                    ],
                    contactInfo: {
                        email: "dr.rajesh.verma@email.com",
                        alternateMobile: "9876543234",
                        emergencyContact: "9876543235"
                    },
                    certifications: ["Ph.D. in Agriculture", "Certified Agricultural Consultant"],
                    licenses: ["Agricultural Consultant License"]
                }
            },
            {
                user: {
                    name: "Modern Farm Equipment Co.",
                    mobileNumber: "9876543236",
                    aadharNumber: "123456789032",
                    pin: "1234",
                    role: "serviceProvider"
                },
                serviceProvider: {
                    businessType: "company",
                    location: {
                        address: "Equipment Hub, Muzaffarpur",
                        pincode: "842003",
                        state: "Bihar",
                        district: "Muzaffarpur",
                        coordinates: { latitude: 26.1209, longitude: 85.3647 }
                    },
                    services: [
                        {
                            serviceName: "Tractor Rental",
                            serviceType: "machinery",
                            description: "Tractor rental with operator for plowing, tilling, and transportation",
                            basePrice: 2000,
                            pricingType: "hourly",
                            serviceArea: 50,
                            isActive: true
                        },
                        {
                            serviceName: "Harvesting Machine Rental",
                            serviceType: "machinery",
                            description: "Combine harvester and other harvesting equipment rental",
                            basePrice: 5000,
                            pricingType: "per_acre",
                            serviceArea: 75,
                            isActive: true
                        }
                    ],
                    contactInfo: {
                        email: "info@modernfarmequipment.com",
                        alternateMobile: "9876543237",
                        emergencyContact: "9876543238",
                        website: "www.modernfarmequipment.com"
                    },
                    certifications: ["Equipment Rental License", "Safety Certification"],
                    licenses: ["Commercial Vehicle License", "Equipment Rental Permit"]
                }
            }
        ];

        // Create users and their role-specific data
        for (const farmerData of farmers) {
            const user = new User(farmerData.user);
            await user.save();
            
            const farmer = new Farmer({
                ...farmerData.farmer,
                userId: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                aadharNumber: user.aadharNumber
            });
            await farmer.save();
            
            user.roleData = farmer._id;
            user.roleRef = 'Farmer';
            user.isProfileComplete = true;
            await user.save();
            
            dummyAccounts.push({
                type: 'Farmer',
                name: user.name,
                mobile: user.mobileNumber,
                aadhar: user.aadharNumber,
                pin: farmerData.user.pin,
                location: farmerData.farmer.location.district + ', ' + farmerData.farmer.location.state
            });
        }

        for (const laborerData of laborers) {
            const user = new User(laborerData.user);
            await user.save();
            
            const laborer = new Laborer({
                ...laborerData.laborer,
                userId: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                aadharNumber: user.aadharNumber
            });
            await laborer.save();
            
            user.roleData = laborer._id;
            user.roleRef = 'Laborer';
            user.isProfileComplete = true;
            await user.save();
            
            dummyAccounts.push({
                type: 'Laborer',
                name: user.name,
                mobile: user.mobileNumber,
                aadhar: user.aadharNumber,
                pin: laborerData.user.pin,
                location: laborerData.laborer.location.district + ', ' + laborerData.laborer.location.state,
                skills: laborerData.laborer.skills.primarySkills.join(', '),
                dailyWage: laborerData.laborer.workDetails.dailyWage
            });
        }

        for (const serviceProviderData of serviceProviders) {
            const user = new User(serviceProviderData.user);
            await user.save();
            
            const serviceProvider = new ServiceProvider({
                ...serviceProviderData.serviceProvider,
                userId: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                aadharNumber: user.aadharNumber
            });
            await serviceProvider.save();
            
            user.roleData = serviceProvider._id;
            user.roleRef = 'ServiceProvider';
            user.isProfileComplete = true;
            await user.save();
            
            dummyAccounts.push({
                type: 'Service Provider',
                name: user.name,
                mobile: user.mobileNumber,
                aadhar: user.aadharNumber,
                pin: serviceProviderData.user.pin,
                location: serviceProviderData.serviceProvider.location.district + ', ' + serviceProviderData.serviceProvider.location.state,
                services: serviceProviderData.serviceProvider.services.map(s => s.serviceName).join(', ')
            });
        }

        console.log(`Created ${dummyAccounts.length} dummy accounts successfully!`);
        
        // Save accounts to file
        const fs = require('fs');
        const accountsData = {
            created_at: new Date().toISOString(),
            total_accounts: dummyAccounts.length,
            accounts: dummyAccounts
        };
        
        fs.writeFileSync('dummy_accounts.json', JSON.stringify(accountsData, null, 2));
        console.log('Dummy accounts saved to dummy_accounts.json');
        
        // Display accounts summary
        console.log('\n=== DUMMY ACCOUNTS CREATED ===');
        dummyAccounts.forEach((account, index) => {
            console.log(`\n${index + 1}. ${account.type}: ${account.name}`);
            console.log(`   Mobile: ${account.mobile}`);
            console.log(`   Aadhar: ${account.aadharNumber}`);
            console.log(`   PIN: ${account.pin}`);
            console.log(`   Location: ${account.location}`);
            if (account.skills) console.log(`   Skills: ${account.skills}`);
            if (account.dailyWage) console.log(`   Daily Wage: ₹${account.dailyWage}`);
            if (account.services) console.log(`   Services: ${account.services}`);
        });

        return dummyAccounts;
    } catch (error) {
        console.error('Error creating dummy accounts:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run if this file is executed directly
if (require.main === module) {
    createDummyAccounts();
}

module.exports = createDummyAccounts;
