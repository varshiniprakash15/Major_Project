const express = require('express');
const router = express.Router();
const GovernmentScheme = require('../models/GovernmentScheme');
const governmentSchemeRAG = require('../services/governmentSchemeRAG');
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

// RAG-based government schemes search
router.get('/government-schemes', authenticateToken, async (req, res) => {
    try {
        const { 
            search, 
            category, 
            language = 'en' // Default to English
        } = req.query;

        console.log('Searching government schemes:', { search, category, language });

        // Use RAG service for intelligent search
        const schemes = await governmentSchemeRAG.searchSchemes(search, language, category);

        res.status(200).json({ 
            schemes: schemes,
            total: schemes.length,
            searchQuery: search || 'all schemes',
            language: language,
            category: category || 'all'
        });
    } catch (error) {
        console.error('Error fetching government schemes:', error);
        res.status(500).json({ message: 'Error fetching government schemes', error: error.message });
    }
});

// Get scheme by ID
router.get('/government-schemes/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const scheme = await GovernmentScheme.findById(id);

        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        res.status(200).json({ scheme });
    } catch (error) {
        console.error('Error fetching scheme:', error);
        res.status(500).json({ message: 'Error fetching scheme', error: error.message });
    }
});

// Get scheme categories
router.get('/scheme-categories', authenticateToken, async (req, res) => {
    try {
        const categories = governmentSchemeRAG.getCategories();
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// AI-powered scheme recommendations based on farmer profile
router.get('/recommended-schemes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Get farmer profile to make AI recommendations
        const Farmer = require('../models/Farmer');
        const farmer = await Farmer.findOne({ userId });

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        // Use RAG service for intelligent recommendations
        const recommendations = await governmentSchemeRAG.getRecommendedSchemes(farmer);

        res.status(200).json({ 
            recommendations: recommendations,
            basedOn: {
                farmType: farmer.farmDetails?.farmType || 'unknown',
                farmSize: farmer.farmDetails?.farmSize || 0,
                location: farmer.location?.state || 'unknown'
            }
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ message: 'Error getting recommendations', error: error.message });
    }
});

module.exports = router;
