# AgroLink - AI-Powered Agricultural Platform
## 🌾 Overview

AgroLink is a comprehensive Artificial General Intelligence (AGI) based agricultural platform that connects farmers, laborers, and service providers in the agricultural ecosystem. The platform leverages modern web technologies, AI-powered filtering, and real-time communication to enhance agricultural productivity and sustainability.

## ✨ Key Features

### 🔐 Enhanced Authentication System
- **PIN-based Authentication**: Secure 6-digit PIN system for user login
- **Role-based Registration**: Separate registration flows for farmers, laborers, and service providers
- **Profile Completion**: Comprehensive profile setup with role-specific information
- **Forgot PIN**: Twilio-integrated PIN recovery system

### 👨‍🌾 Farmer Dashboard
- **Real-time Weather Data**: Current weather conditions and forecasts
- **AI-Powered Laborer Search**: Intelligent filtering and recommendations
- **Service Provider Discovery**: Find and book agricultural services
- **Government Schemes RAG**: AI-powered information retrieval for government schemes
- **Farmer Community**: Real-time communication between farmers
- **Crop Price Tracking**: Market prices and trends
- **Location Services**: GPS integration for farm location tracking

### 👷‍♂️ Laborer Dashboard
- **Profile Management**: Skills, availability, and wage settings
- **Job Management**: Accept, reject, and track job requests
- **Analytics**: Earnings trends and performance metrics
- **Notification System**: Real-time updates on job opportunities
- **Work History**: Complete record of completed jobs and ratings

### 🔧 Service Provider Dashboard
- **Service Management**: Add, edit, and manage agricultural services
- **Booking System**: Handle service requests and bookings
- **Analytics Dashboard**: Revenue tracking and service performance
- **Customer Management**: Track farmer relationships and feedback
- **Pricing Management**: Flexible pricing models (fixed, hourly, per-acre)

### 🤖 AI-Powered Features
- **Intelligent Filtering**: AI-driven search and recommendation system
- **Smart Matching**: Automatic matching of farmers with suitable laborers/services
- **Predictive Analytics**: Weather-based farming recommendations
- **Natural Language Processing**: Enhanced search capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Data visualization
- **React Hot Toast**: Notification system
- **Lucide React**: Icon library

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Twilio**: SMS services

### APIs & Services
- **OpenWeatherMap**: Weather data
- **Google Maps**: Location services
- **Twilio**: SMS notifications

## 📁 Project Structure

```
Agrolink-new-branch/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── adharVerify/
│   │   │   │   └── LoginForm.js
│   │   │   ├── FarmerDashboard/
│   │   │   │   ├── Dashboard.js
│   │   │   │   └── EnhancedDashboard.js
│   │   │   ├── LaborerDashboard/
│   │   │   │   └── EnhancedLaborerDashboard.js
│   │   │   ├── ServiceProviderDashboard/
│   │   │   │   └── EnhancedServiceProviderDashboard.js
│   │   │   ├── RoleSelection.js
│   │   │   ├── ProfileCompletion.js
│   │   │   └── DashboardSelection.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Farmer.js
│   │   ├── Laborer.js
│   │   ├── ServiceProvider.js
│   │   ├── Booking.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── roleRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── bookingRoutes.js
│   ├── App.js
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Twilio Account (for SMS)
- OpenWeatherMap API Key
- Google Maps API Key

### Environment Variables
Create a `.env` file in the server directory:

```env
PORT=6002
MONGODB_URI=mongodb://localhost:27017/agrolink
JWT_SECRET=your-jwt-secret-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
OPENWEATHER_API_KEY=your-openweather-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Agrolink-new-branch
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Start the server**
   ```bash
   cd server
   npm start
   ```

6. **Start the client**
   ```bash
   cd client
   npm start
   ```

## 📱 User Flow

### New User Registration
1. User enters mobile number and Aadhaar number
2. System generates and sends 6-digit PIN via SMS
3. User enters PIN to complete initial registration
4. User selects role (Farmer/Laborer/Service Provider)
5. User completes role-specific profile setup
6. User gains access to respective dashboard

### Existing User Login
1. User enters mobile number and PIN
2. System validates credentials
3. User is redirected to appropriate dashboard based on role

### Farmer Workflow
1. View weather and location data
2. Search for laborers using AI filtering
3. Book laborers for farm work
4. Find and book agricultural services
5. Access government schemes information
6. Communicate with other farmers

### Laborer Workflow
1. Set up profile with skills and availability
2. Receive job notifications
3. Accept/reject job requests
4. Track work history and earnings
5. Manage availability status

### Service Provider Workflow
1. Add and manage services
2. Set pricing and availability
3. Receive service requests
4. Track bookings and revenue
5. Manage customer relationships

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/send-pin` - Send PIN via SMS
- `POST /api/forgot-pin` - Reset PIN

### Role Management
- `POST /api/select-role` - Select user role
- `POST /api/farmer-profile` - Complete farmer profile
- `POST /api/laborer-profile` - Complete laborer profile
- `POST /api/service-provider-profile` - Complete service provider profile

### Bookings & Services
- `POST /api/create-booking` - Create new booking
- `GET /api/my-bookings` - Get user bookings
- `PATCH /api/update-booking/:id` - Update booking status
- `GET /api/laborers` - Get available laborers
- `GET /api/service-providers` - Get available service providers

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean, intuitive design
- **Smooth Animations**: Framer Motion integration
- **Real-time Updates**: Live notifications and status updates
- **Multi-language Support**: English, Hindi, and Kannada
- **Accessibility**: WCAG compliant design

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting for security

## 📊 Database Schema

### User Model
- Basic user information
- Role and profile completion status
- Authentication data

### Farmer Model
- Farm details and location
- Preferences and contact information
- Rating and booking history

### Laborer Model
- Skills and work preferences
- Availability and location
- Work history and ratings

### Service Provider Model
- Business information
- Services offered
- Pricing and availability

### Booking Model
- Booking details and status
- Communication logs
- Payment information

### Notification Model
- Notification content and type
- Read status and timestamps
- User targeting

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client
npm run build

# Start server in production
cd server
NODE_ENV=production npm start
```

### Docker Deployment
```dockerfile
# Dockerfile for server
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6002
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@agrolink.com
- Phone: +91 98765 43210
- Documentation: [docs.agrolink.com](https://docs.agrolink.com)

## 🔮 Future Enhancements

- **Machine Learning**: Advanced crop recommendation system
- **IoT Integration**: Sensor data integration for smart farming
- **Blockchain**: Transparent payment and contract system
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: Predictive farming insights
- **Multi-language Support**: Additional regional languages

---

**AgroLink** - Empowering Agriculture Through Technology 🌱

to implement the text to speddch told by sumalatha mam:-

pip install gTTS