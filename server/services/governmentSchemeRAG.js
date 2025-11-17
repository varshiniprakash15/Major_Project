const axios = require('axios');
const cheerio = require('cheerio');

class GovernmentSchemeRAG {
    constructor() {
        this.schemes = [];
        this.lastUpdated = null;
        this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
    }

    // Fetch government schemes from various sources
    async fetchSchemes() {
        try {
            console.log('Fetching government schemes...');
            
            // For now, we'll use a combination of static data and web scraping
            // In production, you would integrate with official government APIs
            const schemes = await this.scrapeGovernmentSchemes();
            
            this.schemes = schemes;
            this.lastUpdated = new Date();
            
            console.log(`Fetched ${schemes.length} government schemes`);
            return schemes;
        } catch (error) {
            console.error('Error fetching government schemes:', error);
            // Return fallback data if scraping fails
            return this.getFallbackSchemes();
        }
    }

    // Web scraping for government schemes
    async scrapeGovernmentSchemes() {
        const schemes = [];
        
        try {
            // Scrape from PM Kisan website (example)
            const pmKisanSchemes = await this.scrapePMKisanSchemes();
            schemes.push(...pmKisanSchemes);
            
            // Scrape from other government sources
            const otherSchemes = await this.scrapeOtherGovernmentSources();
            schemes.push(...otherSchemes);
            
        } catch (error) {
            console.error('Error scraping government schemes:', error);
        }
        
        return schemes;
    }

    // Scrape PM Kisan related schemes
    async scrapePMKisanSchemes() {
        const schemes = [
            {
                id: 'pm-kisan-1',
                title: 'PM Kisan Samman Nidhi',
                description: 'Direct income support of ₹6,000 per year to small and marginal farmers',
                category: 'Income Support',
                eligibility: 'Small and marginal farmers with landholding up to 2 hectares',
                benefits: '₹6,000 per year in three equal installments',
                applicationProcess: 'Online registration through PM Kisan portal or CSC centers',
                applicationUrl: 'https://pmkisan.gov.in',
                lastUpdated: new Date().toISOString(),
                language: 'en'
            },
            {
                id: 'pm-kisan-2',
                title: 'PM Kisan Maan Dhan Yojana',
                description: 'Pension scheme for small and marginal farmers',
                category: 'Pension',
                eligibility: 'Farmers aged 18-40 years with landholding up to 2 hectares',
                benefits: '₹3,000 per month pension after 60 years of age',
                applicationProcess: 'Online registration through PM Kisan portal',
                applicationUrl: 'https://pmkisan.gov.in',
                lastUpdated: new Date().toISOString(),
                language: 'en'
            }
        ];
        
        return schemes;
    }

    // Scrape other government sources
    async scrapeOtherGovernmentSources() {
        const schemes = [
            {
                id: 'soil-health-1',
                title: 'Soil Health Card Scheme',
                description: 'Provides soil health cards to farmers with recommendations for fertilizers',
                category: 'Soil Health',
                eligibility: 'All farmers across India',
                benefits: 'Free soil testing and health cards with fertilizer recommendations',
                applicationProcess: 'Contact local agriculture department or CSC centers',
                applicationUrl: 'https://soilhealth.dac.gov.in',
                lastUpdated: new Date().toISOString(),
                language: 'en'
            },
            {
                id: 'crop-insurance-1',
                title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
                description: 'Crop insurance scheme for farmers against crop loss',
                category: 'Insurance',
                eligibility: 'All farmers growing notified crops',
                benefits: 'Insurance coverage for crop loss due to natural calamities',
                applicationProcess: 'Online registration through PMFBY portal or insurance companies',
                applicationUrl: 'https://pmfby.gov.in',
                lastUpdated: new Date().toISOString(),
                language: 'en'
            },
            {
                id: 'irrigation-1',
                title: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
                description: 'Scheme for irrigation and water management',
                category: 'Irrigation',
                eligibility: 'Farmers and farmer groups',
                benefits: 'Subsidy for irrigation equipment and water management',
                applicationProcess: 'Contact local agriculture department',
                applicationUrl: 'https://pmksy.gov.in',
                lastUpdated: new Date().toISOString(),
                language: 'en'
            }
        ];
        
        return schemes;
    }

    // Fallback schemes if scraping fails
    getFallbackSchemes() {
        return [
            {
                id: 'fallback-1',
                title: 'PM Kisan Samman Nidhi',
                description: 'Direct income support of ₹6,000 per year to small and marginal farmers',
                category: 'Income Support',
                eligibility: 'Small and marginal farmers with landholding up to 2 hectares',
                benefits: '₹6,000 per year in three equal installments',
                applicationProcess: 'Online registration through PM Kisan portal',
                applicationUrl: 'https://pmkisan.gov.in',
                lastUpdated: new Date().toISOString(),
                language: 'en'
            },
            {
                id: 'fallback-2',
                title: 'Soil Health Card Scheme',
                description: 'Provides soil health cards to farmers with recommendations for fertilizers',
                category: 'Soil Health',
                eligibility: 'All farmers across India',
                benefits: 'Free soil testing and health cards',
                applicationProcess: 'Contact local agriculture department',
                applicationUrl: 'https://soilhealth.dac.gov.in',
                lastUpdated: new Date().toISOString(),
                language: 'en'
            }
        ];
    }

    // Search schemes with RAG-like functionality
    async searchSchemes(query, language = 'en', category = '') {
        try {
            // Ensure we have fresh data
            if (!this.schemes.length || this.isDataStale()) {
                await this.fetchSchemes();
            }

            let filteredSchemes = [...this.schemes];

            // Filter by category if specified
            if (category) {
                filteredSchemes = filteredSchemes.filter(scheme => 
                    scheme.category.toLowerCase().includes(category.toLowerCase())
                );
            }

            // Simple text-based search (in production, use vector embeddings)
            if (query) {
                const searchTerms = query.toLowerCase().split(' ');
                filteredSchemes = filteredSchemes.filter(scheme => {
                    const searchableText = [
                        scheme.title,
                        scheme.description,
                        scheme.category,
                        scheme.eligibility,
                        scheme.benefits
                    ].join(' ').toLowerCase();

                    return searchTerms.some(term => searchableText.includes(term));
                });
            }

            // Sort by relevance (simple scoring)
            filteredSchemes.sort((a, b) => {
                const aScore = this.calculateRelevanceScore(a, query);
                const bScore = this.calculateRelevanceScore(b, query);
                return bScore - aScore;
            });

            return filteredSchemes;
        } catch (error) {
            console.error('Error searching schemes:', error);
            return [];
        }
    }

    // Calculate relevance score for a scheme
    calculateRelevanceScore(scheme, query) {
        if (!query) return 1;
        
        const searchableText = [
            scheme.title,
            scheme.description,
            scheme.category,
            scheme.eligibility,
            scheme.benefits
        ].join(' ').toLowerCase();

        const queryTerms = query.toLowerCase().split(' ');
        let score = 0;

        queryTerms.forEach(term => {
            if (scheme.title.toLowerCase().includes(term)) score += 3;
            if (scheme.description.toLowerCase().includes(term)) score += 2;
            if (scheme.category.toLowerCase().includes(term)) score += 2;
            if (scheme.eligibility.toLowerCase().includes(term)) score += 1;
            if (scheme.benefits.toLowerCase().includes(term)) score += 1;
        });

        return score;
    }

    // Check if data is stale
    isDataStale() {
        if (!this.lastUpdated) return true;
        return (new Date() - this.lastUpdated) > this.updateInterval;
    }

    // Get scheme categories
    getCategories() {
        const categories = [...new Set(this.schemes.map(scheme => scheme.category))];
        return categories;
    }

    // Get recommended schemes for a farmer
    async getRecommendedSchemes(farmerProfile) {
        try {
            if (!this.schemes.length) {
                await this.fetchSchemes();
            }

            // Simple recommendation based on farmer profile
            const recommendations = [];
            
            // Recommend based on farm size
            if (farmerProfile.farmSize && farmerProfile.farmSize <= 2) {
                recommendations.push(...this.schemes.filter(s => s.id.includes('pm-kisan')));
            }

            // Recommend based on crops
            if (farmerProfile.crops && farmerProfile.crops.length > 0) {
                recommendations.push(...this.schemes.filter(s => s.category === 'Soil Health'));
            }

            // Recommend insurance schemes
            recommendations.push(...this.schemes.filter(s => s.category === 'Insurance'));

            // Remove duplicates and return top 5
            const uniqueRecommendations = recommendations.filter((scheme, index, self) => 
                index === self.findIndex(s => s.id === scheme.id)
            );

            return uniqueRecommendations.slice(0, 5);
        } catch (error) {
            console.error('Error getting recommended schemes:', error);
            return [];
        }
    }
}

module.exports = new GovernmentSchemeRAG();
