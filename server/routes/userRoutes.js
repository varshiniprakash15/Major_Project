
//routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const twilio = require('twilio');

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Only initialize Twilio if valid credentials are provided
let client = null;
if (accountSid && authToken && accountSid.startsWith('AC')) {
    client = twilio(accountSid, authToken);
}

function formatIndianPhoneNumber(number) {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');

    // Check if the number already has the country code
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return '+' + cleaned;
    }

    // If it's a 10-digit number, add the country code
    if (cleaned.length === 10) {
        return '+91' + cleaned;
    }

    // If it doesn't match expected formats, return as is (Twilio will validate)
    return number;
}

async function generateAndSendPIN(mobileNumber, message) {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const formattedNumber = formatIndianPhoneNumber(mobileNumber);

    // Check if Twilio is properly configured and client was initialized
    if (!client || !accountSid || !authToken || !twilioPhoneNumber) {
        console.log('Twilio not configured, using development mode');
        console.log(`[DEV MODE] PIN for ${mobileNumber}: ${pin}`);
        return pin;
    }

    try {
        const twilioMessage = await client.messages.create({
            body: `${message} ${pin}`,
            from: twilioPhoneNumber,
            to: formattedNumber
        });

        console.log('Twilio message SID:', twilioMessage.sid);
        return pin;
    } catch (error) {
        console.error('Error sending PIN via Twilio:', error);
        console.log(`[FALLBACK MODE] PIN for ${mobileNumber}: ${pin}`);
        // Return the PIN anyway for development purposes
        return pin;
    }
}

router.post('/send-pin', async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const pin = await generateAndSendPIN(mobileNumber, 'Your Farm Unity PIN is:');
        res.status(200).json({ 
            message: 'PIN sent successfully',
            pin: pin, // Include PIN in response for development
            developmentMode: !accountSid || !authToken || !twilioPhoneNumber
        });
    } catch (error) {
        console.error('Error sending PIN:', error);
        res.status(500).json({
            message: 'Failed to send PIN',
            error: error.message,
            code: error.code,
            moreInfo: error.moreInfo
        });
    }
});

router.post('/forgot-pin', async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPin = await generateAndSendPIN(mobileNumber, 'Your new Farm Unity PIN is:');

        user.pin = newPin; // Will be hashed by pre-save hook
        await user.save();

        res.status(200).json({ 
            message: 'New PIN sent successfully',
            pin: newPin, // Include PIN in response for development
            developmentMode: !accountSid || !authToken || !twilioPhoneNumber
        });
    } catch (error) {
        console.error('Error in forgot PIN process:', error);
        res.status(500).json({
            message: 'Failed to process forgot PIN request',
            error: error.message,
            code: error.code,
            moreInfo: error.moreInfo
        });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, mobileNumber, aadharNumber, pin } = req.body;

        // Validate user input data
        if (!name || !mobileNumber || !aadharNumber || !pin) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ mobileNumber }, { aadharNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this mobile number or Aadhaar number already exists' });
        }

        // Validate PIN - must be exactly 6 digits
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
            return res.status(400).json({ message: 'PIN must be exactly 6 digits' });
        }

        // Create new user (PIN will be hashed by pre-save hook)
        const newUser = new User({
            name,
            mobileNumber,
            aadharNumber,
            pin: pin, // Will be hashed by pre-save hook
        });

        // Save new user to database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { mobileNumber, pin } = req.body;
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await user.comparePin(pin);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Update last login
        await user.updateLastLogin();
        
        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: user._id, mobileNumber: user.mobileNumber, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user._id,
                name: user.name,
                mobileNumber: user.mobileNumber,
                role: user.role,
                isProfileComplete: user.isProfileComplete
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


module.exports = router;