const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
    serviceProviderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceProvider',
        required: function() { return this.bookingType === 'service'; }
    },
    laborerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Laborer',
        required: function() { return this.bookingType === 'labor'; }
    },
    bookingType: { 
        type: String, 
        enum: ['labor', 'service'], 
        required: true 
    },
    serviceDetails: {
        serviceName: { type: String },
        serviceType: { type: String },
        description: { type: String },
        estimatedDuration: { type: Number }, // in hours
        price: { type: Number }
    },
    workDetails: {
        workType: { type: String },
        description: { type: String },
        duration: { type: Number }, // in days
        dailyWage: { type: Number },
        totalAmount: { type: Number }
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    schedule: {
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        preferredTime: { type: String }
    },
    location: {
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    communication: {
        farmerMessage: { type: String },
        providerMessage: { type: String },
        specialInstructions: { type: String }
    },
    payment: {
        status: { 
            type: String, 
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending'
        },
        amount: { type: Number },
        paymentMethod: { type: String },
        transactionId: { type: String }
    },
    rating: {
        farmerRating: { type: Number, min: 1, max: 5 },
        providerRating: { type: Number, min: 1, max: 5 },
        farmerFeedback: { type: String },
        providerFeedback: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

bookingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
