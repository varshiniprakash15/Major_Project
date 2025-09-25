const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleTranslations: {
        en: { type: String },
        hi: { type: String },
        kn: { type: String }
    },
    description: { type: String, required: true },
    descriptionTranslations: {
        en: { type: String },
        hi: { type: String },
        kn: { type: String }
    },
    eligibility: { type: String, required: true },
    eligibilityTranslations: {
        en: { type: String },
        hi: { type: String },
        kn: { type: String }
    },
    benefits: { type: String, required: true },
    benefitsTranslations: {
        en: { type: String },
        hi: { type: String },
        kn: { type: String }
    },
    applicationProcess: { type: String, required: true },
    applicationProcessTranslations: {
        en: { type: String },
        hi: { type: String },
        kn: { type: String }
    },
    category: { 
        type: String, 
        enum: ['income_support', 'insurance', 'soil_health', 'irrigation', 'equipment', 'training', 'credit', 'other'],
        required: true 
    },
    keywords: [{ type: String }],
    targetAudience: {
        farmerType: [{ type: String }],
        landHolding: { min: Number, max: Number },
        income: { min: Number, max: Number }
    },
    validity: {
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        isActive: { type: Boolean, default: true }
    },
    contactInfo: {
        helpline: { type: String },
        website: { type: String },
        email: { type: String }
    },
    documents: [{ type: String }],
    lastUpdated: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
