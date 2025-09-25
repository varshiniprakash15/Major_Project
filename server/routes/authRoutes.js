// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    aadharNumber: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    role: { type: String, enum: ['unregistered', 'farmOwner', 'laborer', 'serviceProvider'], default: 'unregistered' },
    roleData: { type: mongoose.Schema.Types.ObjectId, refPath: 'role' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('pin')) {
        this.pin = await bcrypt.hash(this.pin, 10);
    }
    next();
});

userSchema.methods.comparePin = async function (pin) {
    return bcrypt.compare(pin, this.pin);
};

module.exports = mongoose.model('User', userSchema);