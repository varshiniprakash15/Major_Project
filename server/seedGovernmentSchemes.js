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

        // Comprehensive government schemes data
        const schemes = [
            // Income Support Schemes
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
            },
            {
                title: "Pradhan Mantri Kisan Maan Dhan Yojana",
                description: "Pension scheme for small and marginal farmers",
                eligibility: "Farmers aged 18-40 years with landholding up to 2 hectares",
                benefits: "₹3,000 per month pension after 60 years of age",
                applicationProcess: "Through CSC or online portal",
                category: "income_support",
                keywords: ["pension", "retirement", "small farmers", "marginal farmers"],
                targetAudience: {
                    farmerType: ["small", "marginal"],
                    landHolding: { min: 0, max: 2 },
                    income: { min: 0, max: 100000 }
                },
                validity: {
                    startDate: new Date('2019-09-12'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://pmkmy.gov.in",
                    email: "pmkmy@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
                lastUpdated: new Date('2024-01-10')
            },

            // Insurance Schemes
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
                title: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
                description: "Life insurance scheme for farmers and their families",
                eligibility: "Farmers aged 18-50 years",
                benefits: "₹2 lakh life insurance coverage at ₹330 per year",
                applicationProcess: "Through banks or online application",
                category: "insurance",
                keywords: ["life insurance", "family protection", "low premium"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2015-05-09'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://jansuraksha.gov.in",
                    email: "jansuraksha@gov.in"
                },
                documents: ["Aadhaar Card", "Bank Account Details"],
                lastUpdated: new Date('2024-01-05')
            },

            // Irrigation and Water Management
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
                title: "Jal Shakti Abhiyan",
                description: "Water conservation campaign for sustainable water management",
                eligibility: "All farmers and rural communities",
                benefits: "Technical support and funding for water conservation projects",
                applicationProcess: "Through district administration or online portal",
                category: "irrigation",
                keywords: ["water conservation", "sustainable", "rainwater harvesting", "groundwater"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2019-07-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://jalshakti.gov.in",
                    email: "jalshakti@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Project Proposal"],
                lastUpdated: new Date('2023-12-20')
            },

            // Soil Health and Testing
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
                title: "Paramparagat Krishi Vikas Yojana",
                description: "Promotion of organic farming practices",
                eligibility: "Farmers interested in organic farming",
                benefits: "₹50,000 per hectare for 3 years for organic farming",
                applicationProcess: "Through state agriculture department",
                category: "soil_health",
                keywords: ["organic farming", "sustainable", "chemical free", "natural farming"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0.5, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2015-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://pgsindia-ncof.gov.in",
                    email: "pkvk@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Organic Farming Plan"],
                lastUpdated: new Date('2023-11-30')
            },

            // Equipment and Machinery
            {
                title: "Sub-Mission on Agricultural Mechanization",
                description: "Promotion of agricultural machinery and equipment",
                eligibility: "Farmers, cooperatives, and custom hiring centers",
                benefits: "50-80% subsidy on agricultural machinery",
                applicationProcess: "Through state agriculture department or online portal",
                category: "equipment",
                keywords: ["machinery", "equipment", "tractor", "harvester", "subsidy"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 1, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2014-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://agricoop.gov.in",
                    email: "smam@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Machinery Quotation"],
                lastUpdated: new Date('2023-12-10')
            },
            {
                title: "Custom Hiring Centers Scheme",
                description: "Establishment of custom hiring centers for farm machinery",
                eligibility: "Farmers, cooperatives, and entrepreneurs",
                benefits: "50% subsidy for setting up custom hiring centers",
                applicationProcess: "Through state agriculture department",
                category: "equipment",
                keywords: ["custom hiring", "machinery rental", "equipment sharing", "entrepreneurship"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2014-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://agricoop.gov.in",
                    email: "chc@gov.in"
                },
                documents: ["Aadhaar Card", "Business Plan", "Land Documents"],
                lastUpdated: new Date('2023-11-25')
            },

            // Livestock and Dairy
            {
                title: "Rashtriya Gokul Mission",
                description: "Conservation and development of indigenous cattle breeds",
                eligibility: "Farmers with indigenous cattle",
                benefits: "₹5,000 per animal for maintenance and breeding",
                applicationProcess: "Through state animal husbandry department",
                category: "other",
                keywords: ["cattle", "indigenous breeds", "conservation", "dairy"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2014-12-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://dahd.gov.in",
                    email: "gokul@gov.in"
                },
                documents: ["Aadhaar Card", "Cattle Registration", "Veterinary Certificate"],
                lastUpdated: new Date('2023-12-05')
            },
            {
                title: "National Dairy Plan",
                description: "Development of dairy sector and milk production",
                eligibility: "Dairy farmers and cooperatives",
                benefits: "Financial assistance for dairy infrastructure and breed improvement",
                applicationProcess: "Through state dairy development department",
                category: "other",
                keywords: ["dairy", "milk production", "cooperative", "infrastructure"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2012-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://nddb.coop",
                    email: "ndp@gov.in"
                },
                documents: ["Aadhaar Card", "Dairy Registration", "Milk Production Records"],
                lastUpdated: new Date('2023-11-20')
            },

            // Horticulture and Floriculture
            {
                title: "Mission for Integrated Development of Horticulture",
                description: "Comprehensive development of horticulture sector",
                eligibility: "Farmers engaged in horticulture activities",
                benefits: "Subsidy for seeds, plants, and infrastructure development",
                applicationProcess: "Through state horticulture department",
                category: "other",
                keywords: ["horticulture", "fruits", "vegetables", "flowers", "spices"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0.1, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2014-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://midh.gov.in",
                    email: "midh@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Horticulture Plan"],
                lastUpdated: new Date('2023-12-01')
            },
            {
                title: "National Mission on Medicinal Plants",
                description: "Promotion of medicinal plants cultivation",
                eligibility: "Farmers interested in medicinal plants",
                benefits: "75% subsidy for medicinal plants cultivation",
                applicationProcess: "Through state agriculture department",
                category: "other",
                keywords: ["medicinal plants", "herbs", "ayurveda", "cultivation"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0.1, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2008-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://nmpb.gov.in",
                    email: "nmpb@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Medicinal Plants Plan"],
                lastUpdated: new Date('2023-11-15')
            },

            // Technology and Digital
            {
                title: "Digital Agriculture Mission",
                description: "Promotion of digital technologies in agriculture",
                eligibility: "Farmers and agricultural organizations",
                benefits: "Subsidy for digital tools and technology adoption",
                applicationProcess: "Through state agriculture department or online portal",
                category: "training",
                keywords: ["digital", "technology", "IoT", "precision farming", "drones"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 1, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2021-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://digitalagriculture.gov.in",
                    email: "digitalagri@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Technology Proposal"],
                lastUpdated: new Date('2024-01-01')
            },
            {
                title: "Kisan Sathi App",
                description: "Digital platform for farmers to access government services",
                eligibility: "All farmers with smartphones",
                benefits: "Access to all government schemes and services in one app",
                applicationProcess: "Download app from Google Play Store or App Store",
                category: "training",
                keywords: ["mobile app", "digital services", "government schemes", "information"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://kisansathi.gov.in",
                    email: "kisansathi@gov.in"
                },
                documents: ["Aadhaar Card", "Mobile Number"],
                lastUpdated: new Date('2023-12-30')
            },

            // Marketing and Storage
            {
                title: "Agricultural Marketing Infrastructure",
                description: "Development of agricultural markets and storage facilities",
                eligibility: "Farmers, cooperatives, and private entities",
                benefits: "50% subsidy for market infrastructure development",
                applicationProcess: "Through state agriculture marketing department",
                category: "other",
                keywords: ["marketing", "storage", "cold storage", "market infrastructure"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2014-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://agmarknet.gov.in",
                    email: "agmarknet@gov.in"
                },
                documents: ["Aadhaar Card", "Land Documents", "Project Proposal"],
                lastUpdated: new Date('2023-11-10')
            },
            {
                title: "Operation Greens",
                description: "Price stabilization for tomato, onion, and potato (TOP) crops",
                eligibility: "Farmers growing TOP crops",
                benefits: "Price support and storage infrastructure development",
                applicationProcess: "Through state horticulture department",
                category: "other",
                keywords: ["price support", "TOP crops", "tomato", "onion", "potato"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0.1, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2018-11-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://operationgreens.gov.in",
                    email: "operationgreens@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Crop Details"],
                lastUpdated: new Date('2023-10-25')
            },

            // Research and Development
            {
                title: "National Agricultural Research System",
                description: "Support for agricultural research and development",
                eligibility: "Research institutions and farmers",
                benefits: "Funding for research projects and technology transfer",
                applicationProcess: "Through ICAR or state agriculture universities",
                category: "training",
                keywords: ["research", "development", "technology transfer", "innovation"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2014-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://icar.org.in",
                    email: "icar@gov.in"
                },
                documents: ["Aadhaar Card", "Research Proposal", "Institutional Affiliation"],
                lastUpdated: new Date('2023-10-20')
            },
            {
                title: "Farmer Innovation Fund",
                description: "Support for farmer innovations and traditional knowledge",
                eligibility: "Farmers with innovative ideas",
                benefits: "Up to ₹10 lakh funding for innovative projects",
                applicationProcess: "Through state agriculture department or online portal",
                category: "other",
                keywords: ["innovation", "traditional knowledge", "farmer inventions", "startup"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2020-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://farmerinnovation.gov.in",
                    email: "farmerinnovation@gov.in"
                },
                documents: ["Aadhaar Card", "Innovation Proposal", "Prototype Details"],
                lastUpdated: new Date('2023-10-15')
            },

            // Women and Youth Empowerment
            {
                title: "Mahila Kisan Sashaktikaran Pariyojana",
                description: "Empowerment of women farmers",
                eligibility: "Women farmers and self-help groups",
                benefits: "Training, credit, and technology support for women farmers",
                applicationProcess: "Through state agriculture department or women development department",
                category: "training",
                keywords: ["women farmers", "empowerment", "self-help groups", "training"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2011-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://wcd.nic.in",
                    email: "mksp@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Women Farmer Certificate"],
                lastUpdated: new Date('2023-10-10')
            },
            {
                title: "Agri-Clinics and Agri-Business Centres",
                description: "Support for agricultural graduates to start agri-businesses",
                eligibility: "Agricultural graduates and diploma holders",
                benefits: "Up to ₹20 lakh loan with 44% subsidy for agri-business",
                applicationProcess: "Through NABARD or state agriculture department",
                category: "other",
                keywords: ["agri-business", "entrepreneurship", "graduates", "startup"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2002-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://nabard.org",
                    email: "agri-clinic@nabard.org"
                },
                documents: ["Aadhaar Card", "Educational Certificates", "Business Plan"],
                lastUpdated: new Date('2023-10-05')
            },

            // Climate and Environment
            {
                title: "National Mission for Sustainable Agriculture",
                description: "Promotion of sustainable agricultural practices",
                eligibility: "Farmers practicing sustainable agriculture",
                benefits: "Support for climate-resilient farming practices",
                applicationProcess: "Through state agriculture department",
                category: "soil_health",
                keywords: ["sustainable", "climate resilient", "environment", "conservation"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0.5, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2010-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://nmsa.gov.in",
                    email: "nmsa@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Sustainable Farming Plan"],
                lastUpdated: new Date('2023-09-30')
            },
            {
                title: "Green India Mission",
                description: "Afforestation and forest conservation",
                eligibility: "Farmers and communities for tree plantation",
                benefits: "Financial support for tree plantation and forest conservation",
                applicationProcess: "Through state forest department",
                category: "other",
                keywords: ["afforestation", "tree plantation", "forest conservation", "environment"],
                targetAudience: {
                    farmerType: ["all"],
                    landHolding: { min: 0, max: 1000 },
                    income: { min: 0, max: 1000000 }
                },
                validity: {
                    startDate: new Date('2010-04-01'),
                    endDate: new Date('2025-03-31'),
                    isActive: true
                },
                contactInfo: {
                    helpline: "1800-180-1551",
                    website: "https://moef.gov.in",
                    email: "greenindia@gov.in"
                },
                documents: ["Aadhaar Card", "Land Records", "Tree Plantation Plan"],
                lastUpdated: new Date('2023-09-25')
            },

            // Additional schemes to reach 95 total
            ...Array.from({ length: 75 }, (_, index) => {
                const categories = [
                    "income_support", "credit", "insurance", "irrigation", "soil_health",
                    "equipment", "training", "other"
                ];
                const category = categories[index % categories.length];
                
                const schemeTemplates = {
                    income_support: [
                        "Direct Benefit Transfer for Farmers",
                        "Minimum Support Price Enhancement",
                        "Farmer Income Support Scheme",
                        "Crop Price Stabilization Fund",
                        "Agricultural Income Guarantee Scheme"
                    ],
                    credit: [
                        "Micro Credit for Small Farmers",
                        "Agricultural Term Loan Scheme",
                        "Crop Loan Interest Subvention",
                        "Farmer Credit Guarantee Fund",
                        "Agricultural Development Loan"
                    ],
                    insurance: [
                        "Livestock Insurance Scheme",
                        "Poultry Insurance Program",
                        "Aquaculture Insurance",
                        "Farm Equipment Insurance",
                        "Weather-Based Crop Insurance"
                    ],
                    irrigation: [
                        "Micro Irrigation Development",
                        "Water Harvesting Scheme",
                        "Pond Development Program",
                        "Canal Irrigation Modernization",
                        "Solar Pump Irrigation"
                    ],
                    soil_health: [
                        "Soil Testing Laboratory Setup",
                        "Fertilizer Recommendation System",
                        "Soil Conservation Program",
                        "Organic Manure Production",
                        "Soil Health Monitoring"
                    ],
                    equipment: [
                        "Tractor Subsidy Scheme",
                        "Harvester Machine Program",
                        "Power Tiller Distribution",
                        "Farm Implements Support",
                        "Agricultural Drone Program"
                    ],
                    training: [
                        "Farmer Training Program",
                        "Skill Development Initiative",
                        "Extension Services",
                        "Technology Transfer Training",
                        "Capacity Building Program"
                    ],
                    other: [
                        "Special Agricultural Project",
                        "Innovation Support Program",
                        "Research and Development",
                        "Market Development",
                        "Infrastructure Development"
                    ]
                };

                const templates = schemeTemplates[category];
                const title = templates[index % templates.length];
                
                return {
                    title: `${title} ${index + 1}`,
                    description: `Comprehensive support program for ${category.replace('_', ' ')} development in agriculture sector`,
                    eligibility: `Farmers engaged in ${category.replace('_', ' ')} activities`,
                    benefits: `Financial assistance and technical support for ${category.replace('_', ' ')} development`,
                    applicationProcess: "Through state agriculture department or online portal",
                    category: category,
                    keywords: [category.replace('_', ' '), "agriculture", "support", "development"],
                    targetAudience: {
                        farmerType: ["all"],
                        landHolding: { min: 0, max: 1000 },
                        income: { min: 0, max: 1000000 }
                    },
                    validity: {
                        startDate: new Date('2020-04-01'),
                        endDate: new Date('2025-03-31'),
                        isActive: true
                    },
                    contactInfo: {
                        helpline: "1800-180-1551",
                        website: `https://${category}.gov.in`,
                        email: `${category}@gov.in`
                    },
                    documents: ["Aadhaar Card", "Land Records", "Application Form"],
                    lastUpdated: new Date('2023-12-01')
                };
            })
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
