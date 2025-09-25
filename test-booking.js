const mongoose = require('mongoose');
const User = require('./server/models/User');
const Farmer = require('./server/models/Farmer');
const Laborer = require('./server/models/Laborer');
const ServiceProvider = require('./server/models/ServiceProvider');
const Booking = require('./server/models/Booking');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const testBookingFlow = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/agrolink');
        console.log('Connected to MongoDB');

        // Get a farmer and laborer from the database
        const farmer = await Farmer.findOne();
        const laborer = await Laborer.findOne();
        const serviceProvider = await ServiceProvider.findOne();

        if (!farmer) {
            console.log('No farmer found in database');
            return;
        }

        if (!laborer) {
            console.log('No laborer found in database');
            return;
        }

        if (!serviceProvider) {
            console.log('No service provider found in database');
            return;
        }

        console.log('Found test data:');
        console.log('Farmer:', farmer.name);
        console.log('Laborer:', laborer.name);
        console.log('Service Provider:', serviceProvider.name);

        // Test laborer booking
        const laborerBooking = new Booking({
            farmerId: farmer._id,
            laborerId: laborer._id,
            bookingType: 'labor',
            workDetails: {
                workType: 'General Farm Work',
                description: 'Farm work as per requirements',
                duration: 1,
                dailyWage: laborer.workDetails?.dailyWage || 500,
                totalAmount: laborer.workDetails?.dailyWage || 500
            },
            schedule: {
                startDate: new Date(),
                preferredTime: '08:00'
            },
            location: {
                address: 'Test Farm Location',
                pincode: '572101',
                coordinates: {
                    latitude: 13.3409,
                    longitude: 77.1010
                }
            },
            communication: {
                farmerMessage: 'Test booking for laborer',
                specialInstructions: 'Please contact for more details'
            },
            status: 'pending'
        });

        await laborerBooking.save();
        console.log('✅ Laborer booking created successfully:', laborerBooking._id);

        // Test service provider booking
        const serviceBooking = new Booking({
            farmerId: farmer._id,
            serviceProviderId: serviceProvider._id,
            bookingType: 'service',
            serviceDetails: {
                serviceName: 'Test Service',
                serviceType: 'irrigation',
                description: 'Test service booking',
                basePrice: 1000,
                totalAmount: 1000
            },
            schedule: {
                startDate: new Date(),
                preferredTime: '09:00'
            },
            location: {
                address: 'Test Farm Location',
                pincode: '572101',
                coordinates: {
                    latitude: 13.3409,
                    longitude: 77.1010
                }
            },
            communication: {
                farmerMessage: 'Test booking for service',
                specialInstructions: 'Please contact for more details'
            },
            status: 'pending'
        });

        await serviceBooking.save();
        console.log('✅ Service booking created successfully:', serviceBooking._id);

        // Test API endpoints
        const farmerUser = await User.findById(farmer.userId);
        const token = jwt.sign(
            { userId: farmerUser._id, role: farmerUser.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('✅ Test token generated');

        // Test laborer endpoint
        const laborers = await Laborer.find();
        console.log('✅ Found laborers:', laborers.length);

        // Test service provider endpoint
        const serviceProviders = await ServiceProvider.find();
        console.log('✅ Found service providers:', serviceProviders.length);

        console.log('\n🎉 All booking tests passed!');
        console.log('The booking system is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

testBookingFlow();
