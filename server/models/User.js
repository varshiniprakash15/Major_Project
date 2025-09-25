const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    aadharNumber: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    role: { type: String, enum: ['unregistered', 'farmer', 'laborer', 'serviceProvider'], default: 'unregistered' },
    roleData: { type: mongoose.Schema.Types.ObjectId, refPath: 'roleRef' },
    roleRef: { type: String, enum: ['Farmer', 'Laborer', 'ServiceProvider'] },
    isActive: { type: Boolean, default: true },
    isProfileComplete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
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

userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};

module.exports = mongoose.model('User', userSchema);
