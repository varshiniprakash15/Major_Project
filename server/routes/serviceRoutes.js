const express = require('express');
const router = express.Router();
const Service = require('../models/Services');
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

// Add new service
router.post('/add-service', authenticateToken, async (req, res) => {
    try {
        const { name, amount, mobileNumber } = req.body;
        const userId = req.user.userId;

        // Verify user is a service provider
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return res.status(400).json({ message: 'User is not a service provider' });
        }

        const service = new Service({
            name,
            amount,
            mobileNumber,
            providerId: userId,
            isActive: true,
            isDeleted: false,
            ratings: 0
        });

        await service.save();

        res.status(201).json({ 
            message: 'Service added successfully',
            service: service
        });
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ message: 'Error adding service', error: error.message });
    }
});

// Get all services for a service provider
router.get('/my-services', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Verify user is a service provider
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return res.status(400).json({ message: 'User is not a service provider' });
        }

        // Get all services for this provider (including deactivated ones, but not deleted ones)
        const services = await Service.find({ 
            providerId: userId, 
            isDeleted: false 
        }).sort({ createdAt: -1 });

        res.status(200).json({ services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
});

// Get service provider profile with services
router.get('/service-provider-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Verify user is a service provider
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return res.status(400).json({ message: 'User is not a service provider' });
        }

        // Get all services for this provider (including deactivated ones, but not deleted ones)
        const services = await Service.find({ 
            providerId: userId, 
            isDeleted: false 
        }).sort({ createdAt: -1 });

        res.status(200).json({ 
            serviceProvider,
            services
        });
    } catch (error) {
        console.error('Error fetching service provider profile:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Update service status (activate/deactivate)
router.patch('/service/:serviceId/status', authenticateToken, async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { isActive } = req.body;
        const userId = req.user.userId;

        // Verify user is a service provider
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return res.status(400).json({ message: 'User is not a service provider' });
        }

        // Find the service and verify ownership
        const service = await Service.findOne({ 
            _id: serviceId, 
            providerId: userId,
            isDeleted: false 
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found or access denied' });
        }

        service.isActive = isActive;
        await service.save();

        res.status(200).json({ 
            message: `Service ${isActive ? 'activated' : 'deactivated'} successfully`,
            service: service
        });
    } catch (error) {
        console.error('Error updating service status:', error);
        res.status(500).json({ message: 'Error updating service status', error: error.message });
    }
});

// Delete service (soft delete)
router.delete('/service/:serviceId', authenticateToken, async (req, res) => {
    try {
        const { serviceId } = req.params;
        const userId = req.user.userId;

        // Verify user is a service provider
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return res.status(400).json({ message: 'User is not a service provider' });
        }

        // Find the service and verify ownership
        const service = await Service.findOne({ 
            _id: serviceId, 
            providerId: userId,
            isDeleted: false 
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found or access denied' });
        }

        // Soft delete the service
        service.isDeleted = true;
        service.isActive = false; // Also deactivate it
        await service.save();

        res.status(200).json({ 
            message: 'Service deleted successfully',
            service: service
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Error deleting service', error: error.message });
    }
});

// Get all active services for farmers (public endpoint)
router.get('/services', authenticateToken, async (req, res) => {
    try {
        const { 
            location, 
            minPrice, 
            maxPrice, 
            category, 
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

        // Price range filtering
        if (minPrice || maxPrice) {
            filter.amount = {};
            if (minPrice) filter.amount.$gte = parseInt(minPrice);
            if (maxPrice) filter.amount.$lte = parseInt(maxPrice);
        }

        // Search by service name
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // Category filtering (if we add categories to Service model)
        if (category) {
            filter.category = category;
        }

        // Location filtering (if we add location to Service model)
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const services = await Service.find(filter)
            .populate('providerId', 'name mobileNumber')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalCount = await Service.countDocuments(filter);

        res.status(200).json({ 
            services,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / parseInt(limit)),
                totalCount,
                hasNext: skip + services.length < totalCount,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (error) {
        console.error('Error fetching active services:', error);
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
});

// Update service details
router.patch('/service/:serviceId', authenticateToken, async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { name, amount, mobileNumber } = req.body;
        const userId = req.user.userId;

        // Verify user is a service provider
        const serviceProvider = await ServiceProvider.findOne({ userId });
        if (!serviceProvider) {
            return res.status(400).json({ message: 'User is not a service provider' });
        }

        // Find the service and verify ownership
        const service = await Service.findOne({ 
            _id: serviceId, 
            providerId: userId,
            isDeleted: false 
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found or access denied' });
        }

        // Update service details
        if (name) service.name = name;
        if (amount !== undefined) service.amount = amount;
        if (mobileNumber) service.mobileNumber = mobileNumber;

        await service.save();

        res.status(200).json({ 
            message: 'Service updated successfully',
            service: service
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Error updating service', error: error.message });
    }
});

module.exports = router;
