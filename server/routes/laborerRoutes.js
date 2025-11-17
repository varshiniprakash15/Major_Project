const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Laborer = require('../models/Laborer');
const User = require('../models/User');

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

// Get my laborer profile (visible to laborer)
router.get('/my-laborer-profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const laborer = await Laborer.findOne({ userId, isDeleted: false });
        if (!laborer) {
            return res.status(404).json({ message: 'Laborer profile not found' });
        }
        res.status(200).json({ laborer });
    } catch (error) {
        console.error('Error fetching laborer profile:', error);
        res.status(500).json({ message: 'Error fetching laborer profile', error: error.message });
    }
});

// Update laborer profile (simple fields mapping)
router.patch('/laborer', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { workType, dailyWage, mobileNumber, availability, skills } = req.body;

        const laborer = await Laborer.findOne({ userId, isDeleted: false });
        if (!laborer) {
            return res.status(404).json({ message: 'Laborer profile not found' });
        }

        if (typeof mobileNumber === 'string') {
            laborer.mobileNumber = mobileNumber;
        }
        if (typeof dailyWage === 'number') {
            laborer.workDetails.dailyWage = dailyWage;
        }
        if (typeof availability === 'string') {
            laborer.workDetails.availability = availability;
        }
        if (typeof workType === 'string' && workType.trim().length > 0) {
            // Store as first preferred work type
            const normalized = workType.trim();
            laborer.workDetails.preferredWorkTypes = [normalized];
            // Also make sure skills contain it
            const lower = normalized.toLowerCase();
            const hasSkill = (laborer.skills.primarySkills || []).some(s => s.toLowerCase() === lower);
            if (!hasSkill) {
                laborer.skills.primarySkills = Array.isArray(laborer.skills.primarySkills) ? laborer.skills.primarySkills : [];
                laborer.skills.primarySkills.push(normalized);
            }
        }
        if (Array.isArray(skills)) {
            laborer.skills.primarySkills = skills;
        }

        await laborer.save();
        res.status(200).json({ message: 'Laborer profile updated', laborer });
    } catch (error) {
        console.error('Error updating laborer profile:', error);
        res.status(500).json({ message: 'Error updating laborer profile', error: error.message });
    }
});

// Update laborer status (activate/deactivate)
router.patch('/laborer/status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { isActive } = req.body;
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive must be boolean' });
        }
        const laborer = await Laborer.findOne({ userId, isDeleted: false });
        if (!laborer) {
            return res.status(404).json({ message: 'Laborer profile not found' });
        }
        laborer.isActive = isActive;
        await laborer.save();
        res.status(200).json({ message: `Laborer ${isActive ? 'activated' : 'deactivated'}`, laborer });
    } catch (error) {
        console.error('Error updating laborer status:', error);
        res.status(500).json({ message: 'Error updating laborer status', error: error.message });
    }
});

// Delete laborer profile (soft delete)
router.delete('/laborer', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const laborer = await Laborer.findOne({ userId, isDeleted: false });
        if (!laborer) {
            return res.status(404).json({ message: 'Laborer profile not found' });
        }
        laborer.isDeleted = true;
        laborer.isActive = false;
        await laborer.save();
        res.status(200).json({ message: 'Laborer profile deleted' });
    } catch (error) {
        console.error('Error deleting laborer profile:', error);
        res.status(500).json({ message: 'Error deleting laborer profile', error: error.message });
    }
});

module.exports = router;


