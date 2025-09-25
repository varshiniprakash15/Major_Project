const mongoose = require('mongoose');
const GovernmentScheme = require('./models/GovernmentScheme');
require('dotenv').config();

const seedGovernmentSchemes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/agrolink');
        console.log('Connected to MongoDB');

        // Clear existing schemes
        await GovernmentScheme.deleteMany({});
        console.log('Cleared existing schemes');

        // Sample government schemes data
        const schemes = [
            {
                title: "PM Kisan Samman Nidhi",
                description: "Direct income support of ₹6,000 per year to small and marginal farmers",
                eligibility: "Small and marginal farmers with landholding up to 2 hectares",
                benefits: "₹6,000 per year in three installments of ₹2,000 each",
                applicationProcess: "Online through PM Kisan portal or visit nearest CSC",
                category: "income_support",
                keywords: ["income", "support", "small farmers", "marginal farmers", "direct benefit"],
                targetAudience: {
                    farmerType: ["small", "marginal"],
                    landHolding: { min: 0, max: 2 },
                    income: { min: 0, max: 100000 }
                },
                validity: {
                    startDate: new Date('2019-02-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://pmkisan.gov.in",
                    email: "pmkisan@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
                lastUpdated: new Date('2024-01-15')
            },
            {
                title: "Pradhan Mantri Fasal Bima Yojana",
                description: "Crop insurance scheme to provide financial support to farmers in case of crop failure",
                eligibility: "All farmers growing notified crops",
                benefits: "Premium subsidy and comprehensive risk coverage for crop losses",
                applicationProcess: "Through insurance companies or online portal",
                category: "insurance",
                keywords: ["crop insurance", "risk coverage", "premium subsidy", "crop failure"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2016-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://pmfby.gov.in",
                    email: "pmfby@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Crop Details"],
                lastUpdated: new Date('2024-01-10')
            },
            {
                title: "Soil Health Card Scheme",
                description: "Issue soil health cards to farmers every 2 years with soil testing and recommendations",
                eligibility: "All farmers across the country",
                benefits: "Free soil testing and personalized recommendations for fertilizers and crops",
                applicationProcess: "Visit nearest soil testing lab or online application",
                category: "soil_health",
                keywords: ["soil testing", "health card", "soil analysis", "fertilizer recommendation"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2015-02-19'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://soilhealth.dac.gov.in",
                    email: "soilhealth@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records"],
                lastUpdated: new Date('2024-01-05')
            },
            {
                title: "Pradhan Mantri Krishi Sinchai Yojana",
                description: "Water conservation and irrigation scheme for farmers",
                eligibility: "Farmers with irrigation needs",
                benefits: "Subsidy for irrigation equipment and water conservation structures",
                applicationProcess: "Through state agriculture department or online portal",
                category: "irrigation",
                keywords: ["irrigation", "water conservation", "drip irrigation", "sprinkler"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0.5, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2015-07-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://pmksy.gov.in",
                    email: "pmksy@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Water Source Details"],
                lastUpdated: new Date('2024-01-01')
            },
            {
                title: "Kisan Credit Card Scheme",
                description: "Credit facility for farmers to meet their agricultural and allied activities",
                eligibility: "All farmers including tenant farmers and sharecroppers",
                benefits: "Credit up to ₹3 lakh at 4% interest rate",
                applicationProcess: "Through banks or online application",
                category: "credit",
                keywords: ["credit", "loan", "agricultural finance", "kisan credit card"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('1998-08-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://kcc.gov.in",
                    email: "kcc@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Income Certificate"],
                lastUpdated: new Date('2023-12-15')
            }
        ];

        // Insert schemes
        await GovernmentScheme.insertMany(schemes);
        console.log(`Inserted ${schemes.length} government schemes`);

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run seeding if this file is executed directly
if (require.main === module) {
    seedGovernmentSchemes();
}

module.exports = seedGovernmentSchemes;
