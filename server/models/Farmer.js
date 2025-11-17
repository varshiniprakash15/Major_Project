const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    avatar: { type: String },
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
    farmDetails: {
        farmType: { 
            type: String, 
            enum: ['crop', 'dairy', 'poultry', 'fishery', 'horticulture', 'mixed'],
            required: true 
        },
        farmSize: { type: Number, required: true }, // in acres
        crops: [{ type: String }],
        irrigationType: { 
            type: String, 
            enum: ['drip', 'sprinkler', 'flood', 'manual', 'none'] 
        }
    },
    preferences: {
        preferredLaborTypes: [{ type: String }],
        maxWage: { type: Number },
        preferredServiceTypes: [{ type: String }]
    },
    contactInfo: {
        email: { type: String },
        alternateMobile: { type: String },
        emergencyContact: { type: String }
    },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalBookings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

farmerSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Farmer', farmerSchema);
