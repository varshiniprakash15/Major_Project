const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
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

// Create a new booking
router.post('/create-booking', authenticateToken, async (req, res) => {
    try {
        const {
            serviceProviderId,
            laborerId,
            bookingType,
            serviceDetails,
            workDetails,
            schedule,
            location,
            communication
        } = req.body;

        const farmerId = req.user.userId;

        const booking = new Booking({
            farmerId,
            serviceProviderId,
            laborerId,
            bookingType,
            serviceDetails,
            workDetails,
            schedule,
            location,
            communication,
            status: 'pending'
        });

        await booking.save();

        // Create notification for the service provider or laborer
        let targetUserId;
        if (bookingType === 'service' && serviceProviderId) {
            const serviceProvider = await ServiceProvider.findById(serviceProviderId);
            if (!serviceProvider) {
                return res.status(404).json({ message: 'Service provider not found' });
            }
            targetUserId = serviceProvider.userId;
        } else if (bookingType === 'labor' && laborerId) {
            const laborer = await Laborer.findById(laborerId);
            if (!laborer) {
                return res.status(404).json({ message: 'Laborer not found' });
            }
            targetUserId = laborer.userId;
        }

        if (targetUserId) {
            const notification = new Notification({
                userId: targetUserId,
                type: 'booking_request',
                title: 'New Booking Request',
                message: `You have received a new ${bookingType} booking request`,
                data: {
                    bookingId: booking._id,
                    farmerId: farmerId
                }
            });
            await notification.save();
        }

        res.status(201).json({ 
            message: 'Booking created successfully',
            booking: booking
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Get bookings for a user
router.get('/my-bookings', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, status } = req.query;

        let query = {};
        
        // Determine if user is farmer, laborer, or service provider
        const farmer = await Farmer.findOne({ userId });
        const laborer = await Laborer.findOne({ userId });
        const serviceProvider = await ServiceProvider.findOne({ userId });

        if (farmer) {
            query.farmerId = farmer._id;
        } else if (laborer) {
            query.laborerId = laborer._id;
        } else if (serviceProvider) {
            query.serviceProviderId = serviceProvider._id;
        } else {
            return res.status(404).json({ message: 'User profile not found' });
        }

        if (type) {
            query.bookingType = type;
        }
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('farmerId', 'name mobileNumber')
            .populate('laborerId', 'name mobileNumber')
            .populate('serviceProviderId', 'name mobileNumber')
            .sort({ createdAt: -1 });

        console.log('Found bookings:', bookings.length);
        console.log('Booking IDs:', bookings.map(b => b._id));

        res.status(200).json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Update booking status
router.patch('/update-booking/:bookingId', authenticateToken, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status, message } = req.body;
        const userId = req.user.userId;

        console.log('Update booking request:', { bookingId, status, userId });

        // Validate booking ID format
        if (!bookingId || !bookingId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('Invalid booking ID format:', bookingId);
            return res.status(400).json({ message: 'Invalid booking ID format' });
        }

        // Validate status
        const validStatuses = ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            console.log('Invalid status:', status);
            return res.status(400).json({ message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
        }

        console.log('Looking for booking with ID:', bookingId);
        const booking = await Booking.findById(bookingId);
        console.log('Found booking:', booking ? 'Yes' : 'No');
        if (!booking) {
            console.log('Booking not found in database');
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        console.log('Booking found:', {
            id: booking._id,
            farmerId: booking.farmerId,
            laborerId: booking.laborerId,
            serviceProviderId: booking.serviceProviderId,
            status: booking.status
        });

        // Check if user has permission to update this booking
        console.log('Checking permissions for user:', userId);
        const farmer = await Farmer.findOne({ userId });
        const laborer = await Laborer.findOne({ userId });
        const serviceProvider = await ServiceProvider.findOne({ userId });

        console.log('User profiles found:', { 
            farmer: farmer ? farmer._id : null, 
            laborer: laborer ? laborer._id : null, 
            serviceProvider: serviceProvider ? serviceProvider._id : null 
        });
        console.log('Booking details:', { 
            farmerId: booking.farmerId, 
            laborerId: booking.laborerId, 
            serviceProviderId: booking.serviceProviderId 
        });

        let hasPermission = false;
        if (farmer && booking.farmerId.toString() === farmer._id.toString()) {
            hasPermission = true;
            console.log('Permission granted: Farmer');
        } else if (laborer && booking.laborerId && booking.laborerId.toString() === laborer._id.toString()) {
            hasPermission = true;
            console.log('Permission granted: Laborer');
        } else if (serviceProvider && booking.serviceProviderId && booking.serviceProviderId.toString() === serviceProvider._id.toString()) {
            hasPermission = true;
            console.log('Permission granted: ServiceProvider');
        }

        if (!hasPermission) {
            console.log('Permission denied');
            return res.status(403).json({ message: 'Permission denied' });
        }

        booking.status = status;
        if (message) {
            if (farmer) {
                booking.communication.farmerMessage = message;
            } else if (laborer) {
                booking.communication.providerMessage = message;
            } else if (serviceProvider) {
                booking.communication.providerMessage = message;
            }
        }

        await booking.save();

        // Create notification for the other party
        let targetUserId;
        console.log('Creating notification. Current user type:', farmer ? 'farmer' : laborer ? 'laborer' : serviceProvider ? 'serviceProvider' : 'unknown');
        
        if (farmer) {
            if (booking.laborerId) {
                console.log('Looking for laborer:', booking.laborerId);
                const laborer = await Laborer.findById(booking.laborerId);
                console.log('Found laborer for notification:', laborer ? 'Yes' : 'No');
                if (laborer) {
                    targetUserId = laborer.userId;
                }
            } else if (booking.serviceProviderId) {
                console.log('Looking for service provider:', booking.serviceProviderId);
                const serviceProvider = await ServiceProvider.findById(booking.serviceProviderId);
                console.log('Found service provider for notification:', serviceProvider ? 'Yes' : 'No');
                if (serviceProvider) {
                    targetUserId = serviceProvider.userId;
                }
            }
        } else {
            console.log('Looking for farmer for notification:', booking.farmerId);
            const farmerForNotification = await Farmer.findById(booking.farmerId);
            console.log('Found farmer for notification:', farmerForNotification ? 'Yes' : 'No');
            if (farmerForNotification) {
                targetUserId = farmerForNotification.userId;
            }
        }
        
        console.log('Target user ID for notification:', targetUserId);

        if (targetUserId) {
            try {
                // Map status to valid notification type
                let notificationType;
                switch (status) {
                    case 'accepted':
                        notificationType = 'booking_accepted';
                        break;
                    case 'rejected':
                        notificationType = 'booking_rejected';
                        break;
                    case 'completed':
                        notificationType = 'booking_completed';
                        break;
                    default:
                        notificationType = 'booking_request';
                }

                const notification = new Notification({
                    userId: targetUserId,
                    type: notificationType,
                    title: `Booking ${status}`,
                    message: `Your booking has been ${status}`,
                    data: {
                        bookingId: booking._id
                    }
                });
                await notification.save();
            } catch (notificationError) {
                console.error('Error creating notification:', notificationError);
                // Don't fail the entire request if notification creation fails
            }
        }

        res.status(200).json({ 
            message: 'Booking updated successfully',
            booking: booking
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            bookingId: req.params.bookingId,
            status: req.body.status,
            userId: req.user?.userId
        });
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
});

// Get notifications for a user
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { isRead } = req.query;

        let query = { userId, isActive: true };
        if (isRead !== undefined) {
            query.isRead = isRead === 'true';
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
});

// Mark notification as read
router.patch('/notifications/:notificationId/read', authenticateToken, async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
});

// Get available laborers with AI filtering
router.get('/laborers', authenticateToken, async (req, res) => {
    try {
        const { 
            location, 
            minWage, 
            maxWage, 
            skills, 
            availability,
            rating,
            workRadius 
        } = req.query;

        let query = { isActive: true, isBooked: false };

        if (availability) {
            query['workDetails.availability'] = availability;
        }

        if (rating) {
            query.rating = { $gte: parseInt(rating) };
        }

        let laborers = await Laborer.find(query);

        // Apply additional filters
        if (minWage) {
            laborers = laborers.filter(l => l.workDetails.dailyWage >= parseInt(minWage));
        }
        if (maxWage) {
            laborers = laborers.filter(l => l.workDetails.dailyWage <= parseInt(maxWage));
        }
        if (skills) {
            const skillArray = skills.split(',');
            laborers = laborers.filter(l => 
                skillArray.some(skill => 
                    l.skills.primarySkills.some(ps => 
                        ps.toLowerCase().includes(skill.toLowerCase())
                    )
                )
            );
        }

        res.status(200).json({ laborers });
    } catch (error) {
        console.error('Error fetching laborers:', error);
        res.status(500).json({ message: 'Error fetching laborers', error: error.message });
    }
});

// Get available service providers with AI filtering
router.get('/service-providers', authenticateToken, async (req, res) => {
    try {
        const { 
            location, 
            minPrice, 
            maxPrice, 
            serviceType, 
            rating 
        } = req.query;

        let query = { isActive: true };

        if (rating) {
            query.overallRating = { $gte: parseInt(rating) };
        }

        let serviceProviders = await ServiceProvider.find(query);

        // Apply additional filters
        if (minPrice || maxPrice) {
            serviceProviders = serviceProviders.filter(sp => 
                sp.services.some(service => {
                    if (minPrice && service.basePrice < parseInt(minPrice)) return false;
                    if (maxPrice && service.basePrice > parseInt(maxPrice)) return false;
                    return true;
                })
            );
        }

        if (serviceType) {
            serviceProviders = serviceProviders.filter(sp => 
                sp.services.some(service => 
                    service.serviceType === serviceType
                )
            );
        }

        res.status(200).json({ serviceProviders });
    } catch (error) {
        console.error('Error fetching service providers:', error);
        res.status(500).json({ message: 'Error fetching service providers', error: error.message });
    }
});

module.exports = router;
