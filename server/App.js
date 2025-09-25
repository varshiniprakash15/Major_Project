
require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("./db/conn");


const userRoutes = require('./routes/userRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const roleRoutes = require('./routes/roleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const ragRoutes = require('./routes/ragRoutes');
const messagingRoutes = require('./routes/messagingRoutes');

const port = process.env.PORT || 6002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', registrationRoutes);
app.use('/api', roleRoutes);
app.use('/api', bookingRoutes);
app.use('/api', ragRoutes);
app.use('/api', messagingRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).header('Content-Type', 'application/json').json({
        message: 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
});
app.listen(port, () => {
    console.log(`Server Running on port ${port}`);
});


