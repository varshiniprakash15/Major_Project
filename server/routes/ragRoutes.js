const express = require('express');
const router = express.Router();
const GovernmentScheme = require('../models/GovernmentScheme');
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
            farmerType, 
            landHolding,
            income,
            language = 'kn' // Default to Kannada
        } = req.query;

        let query = { isActive: true };

        // RAG-based search implementation
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { eligibility: { $regex: search, $options: 'i' } },
                { benefits: { $regex: search, $options: 'i' } },
                { keywords: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (category) {
            query.category = category;
        }

        // AI-powered filtering based on farmer profile
        if (farmerType) {
            query['targetAudience.farmerType'] = { $in: [farmerType] };
        }

        if (landHolding) {
            const landHoldingNum = parseInt(landHolding);
            query.$and = [
                { 'targetAudience.landHolding.min': { $lte: landHoldingNum } },
                { 'targetAudience.landHolding.max': { $gte: landHoldingNum } }
            ];
        }

        if (income) {
            const incomeNum = parseInt(income);
            query.$and = [
                { 'targetAudience.income.min': { $lte: incomeNum } },
                { 'targetAudience.income.max': { $gte: incomeNum } }
            ];
        }

        const schemes = await GovernmentScheme.find(query)
            .sort({ lastUpdated: -1 })
            .limit(50);

        // Translate schemes based on language
        const translatedSchemes = schemes.map(scheme => {
            const translated = scheme.toObject();
            
            // Use translations if available, otherwise fallback to original
            if (language !== 'en' && scheme.titleTranslations && scheme.titleTranslations[language]) {
                translated.title = scheme.titleTranslations[language];
            }
            if (language !== 'en' && scheme.descriptionTranslations && scheme.descriptionTranslations[language]) {
                translated.description = scheme.descriptionTranslations[language];
            }
            if (language !== 'en' && scheme.eligibilityTranslations && scheme.eligibilityTranslations[language]) {
                translated.eligibility = scheme.eligibilityTranslations[language];
            }
            if (language !== 'en' && scheme.benefitsTranslations && scheme.benefitsTranslations[language]) {
                translated.benefits = scheme.benefitsTranslations[language];
            }
            if (language !== 'en' && scheme.applicationProcessTranslations && scheme.applicationProcessTranslations[language]) {
                translated.applicationProcess = scheme.applicationProcessTranslations[language];
            }
            
            return translated;
        });

        res.status(200).json({ 
            schemes: translatedSchemes,
            total: translatedSchemes.length,
            searchQuery: search || 'all schemes',
            language: language
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
        const categories = await GovernmentScheme.distinct('category');
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

        // AI recommendation logic
        let recommendations = [];

        // Based on farm type
        if (farmer.farmDetails.farmType === 'crop') {
            const cropSchemes = await GovernmentScheme.find({
                category: { $in: ['irrigation', 'equipment', 'insurance'] },
                isActive: true
            }).limit(5);
            recommendations = [...recommendations, ...cropSchemes];
        }

        // Based on farm size
        if (farmer.farmDetails.farmSize <= 2) {
            const smallFarmerSchemes = await GovernmentScheme.find({
                'targetAudience.farmerType': 'small',
                isActive: true
            }).limit(3);
            recommendations = [...recommendations, ...smallFarmerSchemes];
        }

        // Based on location (state/district)
        if (farmer.location.state) {
            const locationSchemes = await GovernmentScheme.find({
                $or: [
                    { 'targetAudience.region': farmer.location.state },
                    { 'targetAudience.region': 'all' }
                ],
                isActive: true
            }).limit(3);
            recommendations = [...recommendations, ...locationSchemes];
        }

        // Remove duplicates and limit results
        const uniqueRecommendations = recommendations.filter((scheme, index, self) => 
            index === self.findIndex(s => s._id.toString() === scheme._id.toString())
        ).slice(0, 10);

        res.status(200).json({ 
            recommendations: uniqueRecommendations,
            basedOn: {
                farmType: farmer.farmDetails.farmType,
                farmSize: farmer.farmDetails.farmSize,
                location: farmer.location.state
            }
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ message: 'Error getting recommendations', error: error.message });
    }
});

module.exports = router;
