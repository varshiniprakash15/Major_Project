
//routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const FarmOwner = require('../models/FarmerOwner');
const Laborer = require('../models/Laborer');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Services.js')
// const Labour = require('../models/Labourers.js') // DEPRECATED: Using Laborer model instead




function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Aadhaar verification route
router.post('/verify-aadhar', async (req, res) => {
    const { aadharNumber } = req.body;

    if (!aadharNumber || aadharNumber.length !== 12) {
        return res.status(400).json({ message: 'Invalid Aadhaar number' });
    }

    try {
        // Check if the Aadhaar number already exists
        let user = await User.findOne({ aadharNumber });

        if (user && user.isAadhaarVerified) {
            return res.status(400).json({ message: 'Aadhaar number already registered and verified' });
        }

        // Generate OTP
        const otp = generateOTP();

        if (user) {
            // Update existing user with new OTP
            user.otp = otp;
            user.otpExpires = Date.now() + 600000; // OTP expires in 10 minutes
        } else {
            // Create a new user with Aadhaar number and OTP
            user = new User({
                aadharNumber,
                otp,
                otpExpires: Date.now() + 600000 // OTP expires in 10 minutes
            });
        }

        await user.save();

        // In a real-world scenario, you would send the OTP to the user's registered mobile number here
        // For development purposes, we're sending it in the response
        res.status(200).json({ message: 'OTP sent to registered mobile number', otp });
    } catch (error) {
        console.error('Error in Aadhaar verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// OTP verification route
router.post('/verify-otp', async (req, res) => {
    const { aadharNumber, otp } = req.body;

    if (!aadharNumber || !otp) {
        return res.status(400).json({ message: 'Aadhaar number and OTP are required' });
    }

    try {
        const user = await User.findOne({ aadharNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp || Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isAadhaarVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Aadhaar verification successful' });
    } catch (error) {
        console.error('Error in OTP verification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/farmowner', async (req, res) => {
    try {
        const { name, pin, adharNumber, location, farmType, preferredLabor, contactInfo } = req.body;

        const farmOwner = new FarmOwner({
            name,
            pin,
            aadharNumber: adharNumber, // Note the change from adharNumber to aadharNumber
            location,
            farmType,
            preferredLabor,
            contactInfo
        });

        await farmOwner.save();
        res.status(201).json({ message: 'Farm Owner registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering Farm Owner', error: error.message });
    }
});
router.post('/laborer', async (req, res) => {
    try {
        const { name, aadharNumber, pin, skills, preferredWage, preferredWork, preferredLocation, availability, contactInfo } = req.body;

        // Parse skills if it's a comma-separated string
        const primarySkills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : (Array.isArray(skills) ? skills : []);
        
        // Parse location to get district/state (assuming format: "City, State")
        const locationParts = preferredLocation ? preferredLocation.split(',').map(s => s.trim()) : ['Unknown', 'Unknown'];
        const district = locationParts[0] || 'Unknown';
        const state = locationParts[1] || 'Unknown';

        // Map availability values to valid enum values
        let availabilityStatus = 'available';
        if (availability) {
            const lowerAvailability = availability.toLowerCase();
            if (lowerAvailability.includes('busy') || lowerAvailability.includes('seasonal')) {
                availabilityStatus = 'busy';
            } else if (lowerAvailability.includes('unavailable') || lowerAvailability.includes('no')) {
                availabilityStatus = 'unavailable';
            } else {
                availabilityStatus = 'available'; // always, full-time, yes, etc.
            }
        }

        const laborer = new Laborer({
            userId: null, // Will be set when user logs in with proper authentication
            name,
            mobileNumber: contactInfo || '0000000000',
            aadharNumber,
            location: {
                address: preferredLocation || 'Not specified',
                pincode: pin || '000000',
                state: state,
                district: district
            },
            skills: {
                primarySkills: primarySkills.length > 0 ? primarySkills : ['general'],
                experience: 0
            },
            workDetails: {
                dailyWage: parseInt(preferredWage) || 500,
                preferredWorkTypes: preferredWork ? [preferredWork] : ['other'],
                availability: availabilityStatus
            },
            contactInfo: {
                alternateMobile: contactInfo
            }
        });

        await laborer.save();
        res.status(201).json({ message: 'Laborer registered successfully' });
    } catch (error) {
        console.error('Error registering laborer:', error);
        res.status(500).json({ message: 'Error registering Laborer', error: error.message });
    }
});
router.post('/serviceprovider', async (req, res) => {
    try {
        const { name, aadharNumber, pin, serviceType, serviceArea, charges, contactInfo } = req.body;

        const serviceProvider = new ServiceProvider({
            name,
            aadharNumber,
            pin,
            serviceType,
            serviceArea,
            charges,
            contactInfo
        });

        await serviceProvider.save();
        res.status(201).json({ message: 'Service Provider registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering Service Provider', error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const { userId, userType } = req.body;

        if (!userId || !userType) {
            return res.status(400).json({ message: 'User ID and user type are required' });
        }

        let user;
        switch (userType) {
            case 'farmOwner':
                user = await FarmOwner.findByIdAndDelete(userId);
                break;
            case 'laborer':
                user = await Laborer.findByIdAndDelete(userId);
                break;
            case 'serviceProvider':
                user = await ServiceProvider.findByIdAndDelete(userId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Logout successful. User data deleted.' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
});











// Add a new labourer (using new Laborer model)
router.post('/labourers', async (req, res) => {
    try {
        const { name, mobileNumber, aadharNumber, skills, amount, date } = req.body;
        
        // Parse skills if it's a string
        const primarySkills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : (Array.isArray(skills) ? skills : ['general']);
        
        const laborer = new Laborer({
            userId: null,
            name: name || 'Unknown',
            mobileNumber: mobileNumber || '0000000000',
            aadharNumber: aadharNumber || 'N/A',
            location: {
                address: 'Not specified',
                pincode: '000000',
                state: 'Unknown',
                district: 'Unknown'
            },
            skills: {
                primarySkills: primarySkills,
                experience: 0
            },
            workDetails: {
                dailyWage: parseInt(amount) || 500,
                preferredWorkTypes: ['other'],
                availability: 'available'
            },
            createdAt: date || new Date()
        });

        const newLaborer = await laborer.save();
        res.status(201).json(newLaborer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all labourers (using new Laborer model)
router.get('/labourers', async (req, res) => {
    try {
        const laborers = await Laborer.find({ isDeleted: false });
        res.json(laborers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new service
router.post('/services', async (req, res) => {
    const service = new Service({
        name: req.body.name,
        amount: req.body.amount,
        mobileNumber: req.body.mobileNumber
    });
    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all services
router.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;