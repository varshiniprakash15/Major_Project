const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const FarmerGroup = require('../models/FarmerGroup');
const User = require('../models/User');
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

// Get farmer community messages
router.get('/farmer-community', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 50, offset = 0 } = req.query;

        // Get all farmers for community chat
        const Farmer = require('../models/Farmer');
        const farmers = await Farmer.find({ isActive: true });
        const farmerIds = farmers.map(f => f.userId);

        // Get community messages (messages without specific receiver)
        const messages = await Message.find({
            $or: [
                { receiverId: { $exists: false } },
                { groupId: { $exists: true } }
            ],
            isActive: true
        })
        .populate('senderId', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset));

        res.status(200).json({ messages: messages.reverse() });
    } catch (error) {
        console.error('Error fetching community messages:', error);
        res.status(500).json({ message: 'Error fetching community messages', error: error.message });
    }
});

// Send message to farmer community
router.post('/farmer-community', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.userId;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: 'Message cannot be empty' });
        }

        const newMessage = new Message({
            senderId: userId,
            message: message.trim(),
            messageType: 'text'
        });

        await newMessage.save();

        // Populate sender info for response
        await newMessage.populate('senderId', 'name');

        res.status(201).json({ 
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
});

// Get direct messages between farmers
router.get('/direct-messages/:receiverId', authenticateToken, async (req, res) => {
    try {
        const { receiverId } = req.params;
        const userId = req.user.userId;
        const { limit = 50, offset = 0 } = req.query;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: receiverId },
                { senderId: receiverId, receiverId: userId }
            ],
            isActive: true
        })
        .populate('senderId', 'name')
        .populate('receiverId', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset));

        res.status(200).json({ messages: messages.reverse() });
    } catch (error) {
        console.error('Error fetching direct messages:', error);
        res.status(500).json({ message: 'Error fetching direct messages', error: error.message });
    }
});

// Send direct message
router.post('/direct-messages', authenticateToken, async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const userId = req.user.userId;

        if (!receiverId || !message || message.trim().length === 0) {
            return res.status(400).json({ message: 'Receiver ID and message are required' });
        }

        const newMessage = new Message({
            senderId: userId,
            receiverId: receiverId,
            message: message.trim(),
            messageType: 'text'
        });

        await newMessage.save();

        // Populate sender and receiver info
        await newMessage.populate('senderId', 'name');
        await newMessage.populate('receiverId', 'name');

        res.status(201).json({ 
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        console.error('Error sending direct message:', error);
        res.status(500).json({ message: 'Error sending direct message', error: error.message });
    }
});

// Get all farmers for messaging
router.get('/farmers', authenticateToken, async (req, res) => {
    try {
        const Farmer = require('../models/Farmer');
        const farmers = await Farmer.find({ isActive: true })
            .populate('userId', 'name mobileNumber')
            .select('userId location farmDetails');

        res.status(200).json({ farmers });
    } catch (error) {
        console.error('Error fetching farmers:', error);
        res.status(500).json({ message: 'Error fetching farmers', error: error.message });
    }
});

// Mark message as read
router.patch('/messages/:messageId/read', authenticateToken, async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId;

        const message = await Message.findOneAndUpdate(
            { 
                _id: messageId, 
                receiverId: userId,
                isRead: false 
            },
            { 
                isRead: true, 
                readAt: new Date() 
            },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Message not found or already read' });
        }

        res.status(200).json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Error marking message as read', error: error.message });
    }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const unreadCount = await Message.countDocuments({
            receiverId: userId,
            isRead: false,
            isActive: true
        });

        res.status(200).json({ unreadCount });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ message: 'Error getting unread count', error: error.message });
    }
});

module.exports = router;
