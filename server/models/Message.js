const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerGroup' },
    message: { type: String, required: true },
    messageType: { 
        type: String, 
        enum: ['text', 'image', 'file', 'location'],
        default: 'text' 
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
