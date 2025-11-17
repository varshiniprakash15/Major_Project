const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  mobileNumber: { type: String, required: true },
  isActive: { type: Boolean, default: true },   // true = visible to farmers
  isDeleted: { type: Boolean, default: false }, // true = permanently removed
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // link to provider
  ratings: { type: Number, default: 0 } // optional, visible to provider
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
