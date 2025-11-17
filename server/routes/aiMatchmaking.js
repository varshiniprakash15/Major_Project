const express = require('express');
const router = express.Router();
const agenticAI = require('../services/agenticAI');
const Farmer = require('../models/Farmer');
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

// AI-powered laborer matching
router.post('/ai-match-laborers', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { requirements = {} } = req.body;

        // Get farmer profile
        const farmer = await Farmer.findOne({ userId });
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        console.log('AI matching laborers for farmer:', farmer._id);
        
        // Get AI-powered matches
        const matches = await agenticAI.matchLaborers(farmer, requirements);

        res.status(200).json({
            success: true,
            matches: matches.matches,
            reasoning: matches.reasoning,
            totalCandidates: matches.totalCandidates,
            aiInsights: matches.aiInsights,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in AI laborer matching:', error);
        res.status(500).json({ 
            message: 'Error in AI matching', 
            error: error.message 
        });
    }
});

// AI-powered service matching
router.post('/ai-match-services', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { requirements = {} } = req.body;

        // Get farmer profile
        const farmer = await Farmer.findOne({ userId });
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        console.log('AI matching services for farmer:', farmer._id);
        
        // Get AI-powered matches
        const matches = await agenticAI.matchServices(farmer, requirements);

        res.status(200).json({
            success: true,
            matches: matches.matches,
            reasoning: matches.reasoning,
            totalCandidates: matches.totalCandidates,
            aiInsights: matches.aiInsights,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in AI service matching:', error);
        res.status(500).json({ 
            message: 'Error in AI matching', 
            error: error.message 
        });
    }
});

// Get comprehensive AI recommendations
router.get('/ai-recommendations', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get farmer profile
        const farmer = await Farmer.findOne({ userId });
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        console.log('Getting AI recommendations for farmer:', farmer._id);
        
        // Get comprehensive AI recommendations
        const recommendations = await agenticAI.getAIRecommendations(farmer);

        res.status(200).json({
            success: true,
            ...recommendations
        });

    } catch (error) {
        console.error('Error getting AI recommendations:', error);
        res.status(500).json({ 
            message: 'Error getting AI recommendations', 
            error: error.message 
        });
    }
});

// Get AI insights for farmer dashboard
router.get('/ai-insights', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get farmer profile
        const farmer = await Farmer.findOne({ userId });
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        // Get quick AI insights
        const laborerMatches = await agenticAI.matchLaborers(farmer);
        const serviceMatches = await agenticAI.matchServices(farmer);

        const insights = {
            topLaborers: laborerMatches.matches.slice(0, 3),
            topServices: serviceMatches.matches.slice(0, 3),
            laborerInsights: laborerMatches.aiInsights,
            serviceInsights: serviceMatches.aiInsights,
            overallReasoning: {
                laborers: laborerMatches.reasoning,
                services: serviceMatches.reasoning
            },
            timestamp: new Date().toISOString()
        };

        res.status(200).json({
            success: true,
            insights
        });

    } catch (error) {
        console.error('Error getting AI insights:', error);
        res.status(500).json({ 
            message: 'Error getting AI insights', 
            error: error.message 
        });
    }
});

// Natural language query processing
router.post('/ai-query', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // Get farmer profile
        const farmer = await Farmer.findOne({ userId });
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        // Simple natural language processing
        const queryLower = query.toLowerCase();
        let results = {};

        // Check if query is about laborers
        if (queryLower.includes('labor') || queryLower.includes('worker') || queryLower.includes('help')) {
            const laborerMatches = await agenticAI.matchLaborers(farmer);
            results.laborers = laborerMatches;
        }

        // Check if query is about services
        if (queryLower.includes('service') || queryLower.includes('repair') || queryLower.includes('equipment')) {
            const serviceMatches = await agenticAI.matchServices(farmer);
            results.services = serviceMatches;
        }

        // If no specific type mentioned, get both
        if (Object.keys(results).length === 0) {
            const laborerMatches = await agenticAI.matchLaborers(farmer);
            const serviceMatches = await agenticAI.matchServices(farmer);
            results = { laborers: laborerMatches, services: serviceMatches };
        }

        res.status(200).json({
            success: true,
            query,
            results,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error processing AI query:', error);
        res.status(500).json({ 
            message: 'Error processing query', 
            error: error.message 
        });
    }
});

module.exports = router;
