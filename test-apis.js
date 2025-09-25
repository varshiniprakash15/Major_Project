const axios = require('axios');

const BASE_URL = 'http://localhost:6002/api';
let authToken = '';

// Test user registration and login
async function testAuth() {
    console.log('🔐 Testing Authentication APIs...');
    
    try {
        // Test registration (might fail if user exists)
        try {
            const registerResponse = await axios.post(`${BASE_URL}/register`, {
                name: 'Test Farmer',
                mobileNumber: '9999999999',
                aadharNumber: '999999999999',
                pin: '123456'
            });
            console.log('✅ Registration successful:', registerResponse.data);
        } catch (registerError) {
            if (registerError.response?.status === 400 && registerError.response?.data?.message?.includes('already exists')) {
                console.log('ℹ️  User already exists, proceeding with login...');
            } else {
                throw registerError;
            }
        }
        
        // Test login
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            mobileNumber: '9999999999',
            pin: '123456'
        });
        console.log('✅ Login successful:', loginResponse.data);
        authToken = loginResponse.data.token;
        
        return true;
    } catch (error) {
        console.error('❌ Auth test failed:', error.response?.data || error.message);
        return false;
    }
}

// Test role selection
async function testRoleSelection() {
    console.log('\n👤 Testing Role Selection APIs...');
    
    try {
        // Select farmer role
        const roleResponse = await axios.post(`${BASE_URL}/select-role`, {
            role: 'farmer'
        }, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Role selection successful:', roleResponse.data);
        
        return true;
    } catch (error) {
        console.error('❌ Role selection test failed:', error.response?.data || error.message);
        return false;
    }
}

// Test farmer profile completion
async function testFarmerProfile() {
    console.log('\n🌾 Testing Farmer Profile APIs...');
    
    try {
        const profileResponse = await axios.post(`${BASE_URL}/farmer-profile`, {
            location: {
                address: 'Test Farm, Test Village',
                pincode: '560001',
                state: 'Karnataka',
                district: 'Bangalore',
                coordinates: { latitude: 12.9716, longitude: 77.5946 }
            },
            farmDetails: {
                farmType: 'crop',
                farmSize: 5,
                crops: ['Rice', 'Wheat'],
                irrigationType: 'drip'
            },
            preferences: {
                preferredLaborTypes: ['harvesting', 'plowing'],
                maxWage: 500,
                preferredServiceTypes: ['irrigation', 'machinery']
            },
            contactInfo: {
                email: 'test@example.com',
                alternateMobile: '9876543211',
                emergencyContact: '9876543212'
            }
        }, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Farmer profile completion successful:', profileResponse.data);
        
        return true;
    } catch (error) {
        console.error('❌ Farmer profile test failed:', error.response?.data || error.message);
        return false;
    }
}

// Test government schemes RAG
async function testGovernmentSchemes() {
    console.log('\n📚 Testing Government Schemes RAG APIs...');
    
    try {
        // Test getting all schemes
        const schemesResponse = await axios.get(`${BASE_URL}/government-schemes`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Government schemes fetch successful:', schemesResponse.data.schemes.length, 'schemes found');
        
        // Test search
        const searchResponse = await axios.get(`${BASE_URL}/government-schemes?search=PM Kisan`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Government schemes search successful:', searchResponse.data.schemes.length, 'schemes found');
        
        // Test recommended schemes
        const recommendedResponse = await axios.get(`${BASE_URL}/recommended-schemes`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Recommended schemes successful:', recommendedResponse.data.recommendations.length, 'recommendations found');
        
        return true;
    } catch (error) {
        console.error('❌ Government schemes test failed:', error.response?.data || error.message);
        return false;
    }
}

// Test farmer communication
async function testFarmerCommunication() {
    console.log('\n💬 Testing Farmer Communication APIs...');
    
    try {
        // Test getting community messages
        const messagesResponse = await axios.get(`${BASE_URL}/farmer-community`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Community messages fetch successful:', messagesResponse.data.messages.length, 'messages found');
        
        // Test sending a message
        const sendMessageResponse = await axios.post(`${BASE_URL}/farmer-community`, {
            message: 'Hello farmers! This is a test message from the API test.'
        }, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Message send successful:', sendMessageResponse.data);
        
        // Test getting farmers list
        const farmersResponse = await axios.get(`${BASE_URL}/farmers`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Farmers list fetch successful:', farmersResponse.data.farmers.length, 'farmers found');
        
        return true;
    } catch (error) {
        console.error('❌ Farmer communication test failed:', error.response?.data || error.message);
        return false;
    }
}

// Test booking APIs
async function testBookingAPIs() {
    console.log('\n📅 Testing Booking APIs...');
    
    try {
        // Test getting laborers
        const laborersResponse = await axios.get(`${BASE_URL}/laborers`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Laborers fetch successful:', laborersResponse.data.laborers.length, 'laborers found');
        
        // Test getting service providers
        const servicesResponse = await axios.get(`${BASE_URL}/service-providers`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Service providers fetch successful:', servicesResponse.data.serviceProviders.length, 'providers found');
        
        // Test getting bookings
        const bookingsResponse = await axios.get(`${BASE_URL}/my-bookings`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Bookings fetch successful:', bookingsResponse.data.bookings.length, 'bookings found');
        
        return true;
    } catch (error) {
        console.error('❌ Booking APIs test failed:', error.response?.data || error.message);
        return false;
    }
}

// Test notifications
async function testNotifications() {
    console.log('\n🔔 Testing Notification APIs...');
    
    try {
        // Test getting notifications
        const notificationsResponse = await axios.get(`${BASE_URL}/notifications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Notifications fetch successful:', notificationsResponse.data.notifications.length, 'notifications found');
        
        // Test getting unread count
        const unreadResponse = await axios.get(`${BASE_URL}/unread-count`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        console.log('✅ Unread count fetch successful:', unreadResponse.data.unreadCount, 'unread messages');
        
        return true;
    } catch (error) {
        console.error('❌ Notifications test failed:', error.response?.data || error.message);
        return false;
    }
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting API Tests for AgroLink Platform\n');
    
    const tests = [
        { name: 'Authentication', fn: testAuth },
        { name: 'Role Selection', fn: testRoleSelection },
        { name: 'Farmer Profile', fn: testFarmerProfile },
        { name: 'Government Schemes RAG', fn: testGovernmentSchemes },
        { name: 'Farmer Communication', fn: testFarmerCommunication },
        { name: 'Booking APIs', fn: testBookingAPIs },
        { name: 'Notifications', fn: testNotifications }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        try {
            const result = await test.fn();
            if (result) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error(`❌ ${test.name} test crashed:`, error.message);
            failed++;
        }
    }
    
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! The AgroLink platform is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the errors above.');
    }
}

// Run tests
runAllTests().catch(console.error);
