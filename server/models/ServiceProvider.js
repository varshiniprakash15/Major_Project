const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    avatar: { type: String },
    businessType: { 
        type: String, 
        enum: ['individual', 'company', 'cooperative'],
        default: 'individual'
    },
    location: {
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        state: { type: String, required: true },
        district: { type: String, required: true },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    services: [{
        serviceName: { type: String, required: true },
        serviceType: { 
            type: String, 
            enum: ['plumbing', 'electrical', 'machinery', 'irrigation', 'pest_control', 'soil_testing', 'consultation', 'other'],
            required: true 
        },
        description: { type: String },
        basePrice: { type: Number, required: true },
        pricingType: { 
            type: String, 
            enum: ['fixed', 'hourly', 'per_acre', 'per_service'],
            default: 'fixed'
        },
        serviceArea: { type: Number, default: 50 }, // in kilometers
        isActive: { type: Boolean, default: true },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalBookings: { type: Number, default: 0 }
    }],
    contactInfo: {
        email: { type: String },
        alternateMobile: { type: String },
        emergencyContact: { type: String },
        website: { type: String }
    },
    isActive: { type: Boolean, default: true },
    overallRating: { type: Number, default: 0, min: 0, max: 5 },
    totalServices: { type: Number, default: 0 },
    serviceHistory: [{
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
        serviceName: { type: String },
        serviceType: { type: String },
        price: { type: Number },
        rating: { type: Number },
        completedAt: { type: Date },
        feedback: { type: String }
    }],
    certifications: [{ type: String }],
    licenses: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

serviceProviderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);