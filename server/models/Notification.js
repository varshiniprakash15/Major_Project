const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['booking_request', 'booking_accepted', 'booking_rejected', 'booking_completed', 'payment_received', 'rating_received', 'system_alert'],
        required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
        laborerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Laborer' },
        serviceProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider' },
        amount: { type: Number },
        rating: { type: Number }
    },
    isRead: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    createdAt: { type: Date, default: Date.now },
    readAt: { type: Date }
});

notificationSchema.pre('save', function(next) {
    if (this.isRead && !this.readAt) {
        this.readAt = new Date();
    }
    next();
});

module.exports = mongoose.model('Notification', notificationSchema);
