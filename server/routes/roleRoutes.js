const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const Laborer = require('../models/Laborer');
const ServiceProvider = require('../models/ServiceProvider');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Select role after initial registration
router.post('/select-role', authenticateToken, async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user.userId;

        if (!['farmer', 'laborer', 'serviceProvider'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role selected' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ 
            message: 'Role selected successfully',
            role: role
        });
    } catch (error) {
        console.error('Role selection error:', error);
        res.status(500).json({ message: 'Error selecting role', error: error.message });
    }
});

// Complete farmer profile
router.post('/farmer-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'farmer') {
            return res.status(400).json({ message: 'Invalid user or role' });
        }

        const {
            location,
            farmDetails,
            preferences,
            contactInfo
        } = req.body;

        const farmer = new Farmer({
            userId: userId,
            name: user.name,
            mobileNumber: user.mobileNumber,
            aadharNumber: user.aadharNumber,
            location,
            farmDetails,
            preferences,
            contactInfo
        });

        await farmer.save();

        // Update user profile completion status
        user.isProfileComplete = true;
        user.roleData = farmer._id;
        user.roleRef = 'Farmer';
        await user.save();

        res.status(201).json({ 
            message: 'Farmer profile completed successfully',
            farmerId: farmer._id
        });
    } catch (error) {
        console.error('Farmer profile error:', error);
        res.status(500).json({ message: 'Error completing farmer profile', error: error.message });
    }
});

// Complete laborer profile
router.post('/laborer-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'laborer') {
            return res.status(400).json({ message: 'Invalid user or role' });
        }

        const {
            location,
            skills,
            workDetails,
            contactInfo
        } = req.body;

        const laborer = new Laborer({
            userId: userId,
            name: user.name,
            mobileNumber: user.mobileNumber,
            aadharNumber: user.aadharNumber,
            location,
            skills,
            workDetails,
            contactInfo
        });

        await laborer.save();

        // Update user profile completion status
        user.isProfileComplete = true;
        user.roleData = laborer._id;
        user.roleRef = 'Laborer';
        await user.save();

        res.status(201).json({ 
            message: 'Laborer profile completed successfully',
            laborerId: laborer._id
        });
    } catch (error) {
        console.error('Laborer profile error:', error);
        res.status(500).json({ message: 'Error completing laborer profile', error: error.message });
    }
});

// Complete service provider profile
router.post('/service-provider-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user || user.role !== 'serviceProvider') {
            return res.status(400).json({ message: 'Invalid user or role' });
        }

        const {
            businessType,
            location,
            services,
            contactInfo,
            certifications,
            licenses
        } = req.body;

        const serviceProvider = new ServiceProvider({
            userId: userId,
            name: user.name,
            mobileNumber: user.mobileNumber,
            aadharNumber: user.aadharNumber,
            businessType,
            location,
            services,
            contactInfo,
            certifications,
            licenses
        });

        await serviceProvider.save();

        // Update user profile completion status
        user.isProfileComplete = true;
        user.roleData = serviceProvider._id;
        user.roleRef = 'ServiceProvider';
        await user.save();

        res.status(201).json({ 
            message: 'Service provider profile completed successfully',
            serviceProviderId: serviceProvider._id
        });
    } catch (error) {
        console.error('Service provider profile error:', error);
        res.status(500).json({ message: 'Error completing service provider profile', error: error.message });
    }
});

// Get user profile status
router.get('/profile-status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate('roleData');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            role: user.role,
            isProfileComplete: user.isProfileComplete,
            profileData: user.roleData
        });
    } catch (error) {
        console.error('Profile status error:', error);
        res.status(500).json({ message: 'Error fetching profile status', error: error.message });
    }
});

// Get all laborers
router.get('/labourers', authenticateToken, async (req, res) => {
    try {
        const { 
            location, 
            minWage, 
            maxWage, 
            skills, 
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            limit = 50,
            page = 1
        } = req.query;

        // Build filter query
        let filter = { 
            isActive: true, 
            isDeleted: false 
        };

        // Wage range filtering
        if (minWage || maxWage) {
            filter['workDetails.dailyWage'] = {};
            if (minWage) filter['workDetails.dailyWage'].$gte = parseInt(minWage);
            if (maxWage) filter['workDetails.dailyWage'].$lte = parseInt(maxWage);
        }

        // Skills filtering
        if (skills) {
            const skillArray = skills.split(',').map(s => s.trim());
            filter['skills.primarySkills'] = { $in: skillArray };
        }

        // Search by name or skills
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'skills.primarySkills': { $regex: search, $options: 'i' } }
            ];
        }

        // Location filtering
        if (location) {
            filter.$or = [
                { 'location.district': { $regex: location, $options: 'i' } },
                { 'location.state': { $regex: location, $options: 'i' } },
                { 'location.address': { $regex: location, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const laborers = await Laborer.find(filter)
            .populate('userId', 'name mobileNumber')
            .select('userId location skills workDetails contactInfo')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalCount = await Laborer.countDocuments(filter);

        // Transform data for frontend
        const transformedLaborers = laborers.map(laborer => ({
            id: laborer._id,
            name: laborer.name,
            mobileNumber: laborer.mobileNumber,
            skills: laborer.skills.primarySkills.join(', '),
            amount: laborer.workDetails.dailyWage,
            date: 'Available Now',
            location: laborer.location.district + ', ' + laborer.location.state,
            experience: laborer.skills.experience,
            rating: 4.5, // Default rating
            availability: laborer.workDetails.availability,
            workRadius: laborer.workDetails.workRadius
        }));

        res.status(200).json({
            laborers: transformedLaborers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / parseInt(limit)),
                totalCount,
                hasNext: skip + laborers.length < totalCount,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Error fetching laborers:', error);
        res.status(500).json({ message: 'Error fetching laborers', error: error.message });
    }
});

// Get all service providers (deprecated - use /api/services from serviceRoutes instead)
router.get('/services', authenticateToken, async (req, res) => {
    try {
        const Service = require('../models/Services');
        
        // Get only active and non-deleted services
        const services = await Service.find({ 
            isActive: true, 
            isDeleted: false 
        })
        .populate('providerId', 'name mobileNumber')
        .sort({ createdAt: -1 });

        res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
});

// Get all farmers
router.get('/farmers', authenticateToken, async (req, res) => {
    try {
        const farmers = await Farmer.find({ isActive: true })
            .populate('userId', 'name mobileNumber')
            .select('userId location farmDetails contactInfo');

        res.status(200).json({ farmers });
    } catch (error) {
        console.error('Error fetching farmers:', error);
        res.status(500).json({ message: 'Error fetching farmers', error: error.message });
    }
});

module.exports = router;
