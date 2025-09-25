const mongoose = require('mongoose');

const laborerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
    skills: {
        primarySkills: [{ type: String, required: true }],
        additionalSkills: [{ type: String }],
        experience: { type: Number, default: 0 }, // in years
        certifications: [{ type: String }]
    },
    workDetails: {
        dailyWage: { type: Number, required: true },
        preferredWorkTypes: [{ 
            type: String, 
            enum: ['harvesting', 'plowing', 'irrigation', 'seeding', 'fertilizing', 'planting', 'weeding', 'pruning', 'other'] 
        }],
        availability: { 
            type: String, 
            enum: ['available', 'busy', 'unavailable'],
            default: 'available'
        },
        workRadius: { type: Number, default: 50 }, // in kilometers
        preferredTimings: {
            startTime: { type: String },
            endTime: { type: String },
            workingDays: [{ type: String }] // ['monday', 'tuesday', etc.]
        }
    },
    contactInfo: {
        email: { type: String },
        alternateMobile: { type: String },
        emergencyContact: { type: String }
    },
    isActive: { type: Boolean, default: true },
    isBooked: { type: Boolean, default: false },
    currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalJobs: { type: Number, default: 0 },
    workHistory: [{
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
        jobType: { type: String },
        duration: { type: Number }, // in days
        wage: { type: Number },
        rating: { type: Number },
        completedAt: { type: Date },
        feedback: { type: String }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

laborerSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Laborer', laborerSchema);