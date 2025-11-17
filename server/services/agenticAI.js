const Laborer = require('../models/Laborer');
const Service = require('../models/Services');
const Farmer = require('../models/Farmer');

class AgenticAI {
    constructor() {
        this.scoringWeights = {
            location: 0.25,
            price: 0.20,
            skills: 0.25,
            rating: 0.15,
            availability: 0.10,
            experience: 0.05
        };
    }

    // Main matchmaking function for laborers
    async matchLaborers(farmerProfile, requirements = {}) {
        try {
            console.log('Starting laborer matchmaking for farmer:', farmerProfile._id);
            
            // Get all active laborers
            const laborers = await Laborer.find({ 
                isActive: true, 
                isDeleted: false 
            }).populate('userId', 'name mobileNumber');

            if (!laborers.length) {
                return { matches: [], reasoning: 'No laborers available' };
            }

            // Score each laborer
            const scoredLaborers = laborers.map(laborer => {
                const score = this.calculateLaborerScore(laborer, farmerProfile, requirements);
                return {
                    ...laborer.toObject(),
                    aiScore: score.total,
                    scoreBreakdown: score.breakdown,
                    reasoning: this.generateLaborerReasoning(laborer, farmerProfile, score)
                };
            });

            // Sort by AI score
            scoredLaborers.sort((a, b) => b.aiScore - a.aiScore);

            // Return top matches with explanations
            const topMatches = scoredLaborers.slice(0, 10);
            
            return {
                matches: topMatches,
                reasoning: this.generateOverallReasoning(topMatches, farmerProfile),
                totalCandidates: laborers.length,
                aiInsights: this.generateAIInsights(topMatches, farmerProfile)
            };

        } catch (error) {
            console.error('Error in laborer matchmaking:', error);
            throw error;
        }
    }

    // Main matchmaking function for services
    async matchServices(farmerProfile, requirements = {}) {
        try {
            console.log('Starting service matchmaking for farmer:', farmerProfile._id);
            
            // Get all active services
            const services = await Service.find({ 
                isActive: true, 
                isDeleted: false 
            }).populate('providerId', 'name mobileNumber');

            if (!services.length) {
                return { matches: [], reasoning: 'No services available' };
            }

            // Score each service
            const scoredServices = services.map(service => {
                const score = this.calculateServiceScore(service, farmerProfile, requirements);
                return {
                    ...service.toObject(),
                    aiScore: score.total,
                    scoreBreakdown: score.breakdown,
                    reasoning: this.generateServiceReasoning(service, farmerProfile, score)
                };
            });

            // Sort by AI score
            scoredServices.sort((a, b) => b.aiScore - a.aiScore);

            // Return top matches with explanations
            const topMatches = scoredServices.slice(0, 10);
            
            return {
                matches: topMatches,
                reasoning: this.generateOverallReasoning(topMatches, farmerProfile),
                totalCandidates: services.length,
                aiInsights: this.generateAIInsights(topMatches, farmerProfile)
            };

        } catch (error) {
            console.error('Error in service matchmaking:', error);
            throw error;
        }
    }

    // Calculate comprehensive score for a laborer
    calculateLaborerScore(laborer, farmerProfile, requirements) {
        const breakdown = {};

        // Location proximity score (0-100)
        breakdown.location = this.calculateLocationScore(laborer.location, farmerProfile.location);

        // Price compatibility score (0-100)
        breakdown.price = this.calculatePriceScore(
            laborer.workDetails.dailyWage, 
            farmerProfile.preferences?.maxWage || 1000
        );

        // Skills match score (0-100)
        breakdown.skills = this.calculateSkillsScore(
            laborer.skills.primarySkills, 
            requirements.skills || farmerProfile.preferences?.preferredLaborTypes || []
        );

        // Rating score (0-100)
        breakdown.rating = this.calculateRatingScore(laborer.rating || 4.0);

        // Availability score (0-100)
        breakdown.availability = this.calculateAvailabilityScore(laborer.workDetails.availability);

        // Experience score (0-100)
        breakdown.experience = this.calculateExperienceScore(laborer.skills.experience || 0);

        // Calculate weighted total
        const total = Object.keys(breakdown).reduce((sum, key) => {
            return sum + (breakdown[key] * this.scoringWeights[key]);
        }, 0);

        return { total: Math.round(total), breakdown };
    }

    // Calculate comprehensive score for a service
    calculateServiceScore(service, farmerProfile, requirements) {
        const breakdown = {};

        // Price compatibility score (0-100)
        breakdown.price = this.calculatePriceScore(
            service.amount, 
            farmerProfile.preferences?.maxWage || 2000
        );

        // Service relevance score (0-100)
        breakdown.skills = this.calculateServiceRelevanceScore(
            service.name, 
            requirements.serviceType || farmerProfile.preferences?.preferredServiceTypes || []
        );

        // Rating score (0-100)
        breakdown.rating = this.calculateRatingScore(service.ratings || 4.0);

        // Provider reputation score (0-100)
        breakdown.availability = this.calculateProviderReputationScore(service);

        // Location score (0-100) - if service has location info
        breakdown.location = this.calculateServiceLocationScore(service, farmerProfile.location);

        // Experience score (0-100) - based on service age
        breakdown.experience = this.calculateServiceExperienceScore(service);

        // Calculate weighted total
        const total = Object.keys(breakdown).reduce((sum, key) => {
            return sum + (breakdown[key] * this.scoringWeights[key]);
        }, 0);

        return { total: Math.round(total), breakdown };
    }

    // Location proximity scoring
    calculateLocationScore(laborerLocation, farmerLocation) {
        if (!laborerLocation || !farmerLocation) return 50; // Neutral score if no location data
        
        // Simple distance calculation (in production, use proper geolocation)
        const isSameDistrict = laborerLocation.district === farmerLocation.district;
        const isSameState = laborerLocation.state === farmerLocation.state;
        
        if (isSameDistrict) return 100;
        if (isSameState) return 80;
        return 60;
    }

    // Price compatibility scoring
    calculatePriceScore(laborerPrice, farmerMaxPrice) {
        if (!farmerMaxPrice) return 80; // Neutral if no price preference
        
        const ratio = laborerPrice / farmerMaxPrice;
        
        if (ratio <= 0.7) return 100; // Great deal
        if (ratio <= 0.9) return 85;  // Good deal
        if (ratio <= 1.0) return 70;  // Acceptable
        if (ratio <= 1.2) return 50;  // Slightly expensive
        return 30; // Too expensive
    }

    // Skills matching scoring
    calculateSkillsScore(laborerSkills, requiredSkills) {
        if (!requiredSkills.length) return 70; // Neutral if no specific requirements
        
        const commonSkills = laborerSkills.filter(skill => 
            requiredSkills.some(req => 
                skill.toLowerCase().includes(req.toLowerCase()) || 
                req.toLowerCase().includes(skill.toLowerCase())
            )
        );
        
        const matchRatio = commonSkills.length / requiredSkills.length;
        return Math.min(100, matchRatio * 100);
    }

    // Service relevance scoring
    calculateServiceRelevanceScore(serviceName, preferredTypes) {
        if (!preferredTypes.length) return 70;
        
        const serviceLower = serviceName.toLowerCase();
        const hasMatch = preferredTypes.some(type => 
            serviceLower.includes(type.toLowerCase()) || 
            type.toLowerCase().includes(serviceLower)
        );
        
        return hasMatch ? 90 : 50;
    }

    // Rating scoring
    calculateRatingScore(rating) {
        if (!rating) return 60; // Default for unrated
        return Math.min(100, rating * 20); // Convert 5-star to 100-point scale
    }

    // Availability scoring
    calculateAvailabilityScore(availability) {
        switch (availability) {
            case 'available': return 100;
            case 'busy': return 60;
            case 'unavailable': return 20;
            default: return 70;
        }
    }

    // Experience scoring
    calculateExperienceScore(experience) {
        if (!experience) return 50;
        return Math.min(100, experience * 10); // 10 years = 100 points
    }

    // Provider reputation scoring
    calculateProviderReputationScore(service) {
        // Simple scoring based on service age and ratings
        const ageInDays = (new Date() - new Date(service.createdAt)) / (1000 * 60 * 60 * 24);
        const ageScore = Math.min(100, ageInDays * 2); // Older services get higher score
        const ratingScore = this.calculateRatingScore(service.ratings);
        
        return (ageScore + ratingScore) / 2;
    }

    // Service location scoring
    calculateServiceLocationScore(service, farmerLocation) {
        // For services, location is less critical than for laborers
        return 70; // Neutral score
    }

    // Service experience scoring
    calculateServiceExperienceScore(service) {
        const ageInDays = (new Date() - new Date(service.createdAt)) / (1000 * 60 * 60 * 24);
        return Math.min(100, ageInDays * 5); // 20 days = 100 points
    }

    // Generate reasoning for laborer match
    generateLaborerReasoning(laborer, farmerProfile, score) {
        const reasons = [];
        
        if (score.breakdown.location >= 80) {
            reasons.push('Located in the same area');
        }
        
        if (score.breakdown.price >= 80) {
            reasons.push('Price fits your budget');
        }
        
        if (score.breakdown.skills >= 80) {
            reasons.push('Skills match your requirements');
        }
        
        if (score.breakdown.rating >= 80) {
            reasons.push('Highly rated by other farmers');
        }
        
        if (score.breakdown.availability === 100) {
            reasons.push('Currently available');
        }
        
        if (score.breakdown.experience >= 80) {
            reasons.push('Experienced professional');
        }

        return reasons.length > 0 ? reasons.join(', ') : 'Good overall match';
    }

    // Generate reasoning for service match
    generateServiceReasoning(service, farmerProfile, score) {
        const reasons = [];
        
        if (score.breakdown.price >= 80) {
            reasons.push('Competitive pricing');
        }
        
        if (score.breakdown.skills >= 80) {
            reasons.push('Service matches your needs');
        }
        
        if (score.breakdown.rating >= 80) {
            reasons.push('Highly rated service provider');
        }
        
        if (score.breakdown.availability >= 80) {
            reasons.push('Reliable service provider');
        }

        return reasons.length > 0 ? reasons.join(', ') : 'Good service match';
    }

    // Generate overall reasoning
    generateOverallReasoning(matches, farmerProfile) {
        if (matches.length === 0) {
            return 'No suitable matches found based on your requirements';
        }

        const topMatch = matches[0];
        const avgScore = matches.reduce((sum, match) => sum + match.aiScore, 0) / matches.length;
        
        let reasoning = `Found ${matches.length} matches with an average AI score of ${Math.round(avgScore)}/100. `;
        
        if (topMatch.aiScore >= 90) {
            reasoning += 'Excellent matches available!';
        } else if (topMatch.aiScore >= 75) {
            reasoning += 'Good matches found for your requirements.';
        } else {
            reasoning += 'Some matches available, consider adjusting your criteria.';
        }

        return reasoning;
    }

    // Generate AI insights
    generateAIInsights(matches, farmerProfile) {
        const insights = [];
        
        if (matches.length > 0) {
            const avgPrice = matches.reduce((sum, match) => sum + (match.dailyWage || match.amount), 0) / matches.length;
            insights.push(`Average cost: ₹${Math.round(avgPrice)}`);
            
            const highRated = matches.filter(match => (match.rating || match.ratings || 0) >= 4.0).length;
            insights.push(`${highRated} highly rated options available`);
            
            const available = matches.filter(match => match.availability === 'available' || match.isActive).length;
            insights.push(`${available} currently available`);
        }

        return insights;
    }

    // Get AI recommendations based on farmer profile
    async getAIRecommendations(farmerProfile) {
        try {
            const laborerMatches = await this.matchLaborers(farmerProfile);
            const serviceMatches = await this.matchServices(farmerProfile);

            return {
                laborers: laborerMatches,
                services: serviceMatches,
                timestamp: new Date().toISOString(),
                farmerProfile: {
                    farmType: farmerProfile.farmDetails?.farmType,
                    farmSize: farmerProfile.farmDetails?.farmSize,
                    location: farmerProfile.location?.state
                }
            };
        } catch (error) {
            console.error('Error getting AI recommendations:', error);
            throw error;
        }
    }
}

module.exports = new AgenticAI();
