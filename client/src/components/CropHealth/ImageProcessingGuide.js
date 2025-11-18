/**
 * IMAGE PROCESSING FOR API - USAGE GUIDE
 * =======================================
 * 
 * This file demonstrates how to properly process images for the n8n API
 * to avoid "Download Image" node errors.
 * 
 * PROBLEM:
 * --------
 * The n8n workflow's "Download Image" node fails when receiving base64
 * strings with the "data:image/jpeg;base64," prefix.
 * 
 * SOLUTION:
 * ---------
 * Remove the data URI prefix before sending to API.
 * 
 * AVAILABLE UTILITY FUNCTIONS:
 * ----------------------------
 */

import { 
    removeBase64Prefix,      // Remove data URI prefix
    processImageForAPI,      // Complete processing for API
    convertToBase64,         // Convert file to base64 (with prefix)
    compressImage           // Compress and convert (with prefix)
} from '../utils/imageUtils';

/**
 * EXAMPLE 1: Basic Usage - Remove Prefix from Existing Base64
 * ------------------------------------------------------------
 */
function example1_removePrefix() {
    const base64WithPrefix = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...";
    const cleanBase64 = removeBase64Prefix(base64WithPrefix);
    
    console.log('Input:', base64WithPrefix.substring(0, 50));
    // Output: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
    
    console.log('Output:', cleanBase64.substring(0, 50));
    // Output: "/9j/4AAQSkZJRgABAQAA..."
}

/**
 * EXAMPLE 2: Process Image from File Input
 * -----------------------------------------
 */
async function example2_processImageFromFile(fileInput) {
    const file = fileInput.files[0];
    
    try {
        // Get clean base64 for API
        const cleanBase64 = await processImageForAPI(file);
        
        // Send to API
        const response = await fetch('https://n8n-hn7y.onrender.com/webhook/agri-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'disease',
                image: cleanBase64  // ✅ Clean base64, no prefix
            })
        });
        
        console.log('API Response:', await response.json());
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * EXAMPLE 3: Complete Image Upload Handler (Like CropHealthDashboard)
 * --------------------------------------------------------------------
 */
async function example3_completeHandler(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        // Step 1: Get compressed base64 WITH prefix (for preview)
        const base64WithPrefix = await compressImage(file);
        
        // Step 2: Display preview using the version with prefix
        document.getElementById('preview').src = base64WithPrefix;
        
        // Step 3: Remove prefix for API
        const cleanBase64 = removeBase64Prefix(base64WithPrefix);
        
        // Step 4: Send to API
        const apiPayload = {
            type: 'disease',
            image: cleanBase64  // ✅ No prefix!
        };
        
        console.log('Sending to API:');
        console.log('- Image starts with:', cleanBase64.substring(0, 30));
        console.log('- Has prefix?', cleanBase64.startsWith('data:'));  // Should be false
        
        const response = await fetch('https://n8n-hn7y.onrender.com/webhook/agri-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload)
        });
        
        const result = await response.json();
        console.log('Result:', result);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * CORRECT API PAYLOAD FORMAT:
 * ---------------------------
 */
const CORRECT_PAYLOAD = {
    type: "disease",
    image: "/9j/4AAQSkZJRgABAQAA..."  // ✅ Pure base64
};

/**
 * INCORRECT API PAYLOAD FORMAT (CAUSES ERROR):
 * --------------------------------------------
 */
const INCORRECT_PAYLOAD = {
    type: "disease",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."  // ❌ Has prefix!
};

/**
 * HOW IT WORKS IN CropHealthDashboard:
 * ------------------------------------
 * 
 * 1. User selects image
 * 2. compressImage() creates base64 WITH prefix
 * 3. Base64 with prefix stored in imagePreview (for display)
 * 4. removeBase64Prefix() removes the prefix
 * 5. Clean base64 stored in selectedImage (for API)
 * 6. API call uses selectedImage (clean version)
 * 
 * STATE MANAGEMENT:
 * - imagePreview: "data:image/jpeg;base64,/9j/4AAQ..."  (for <img> display)
 * - selectedImage: "/9j/4AAQSkZJRgABAQAA..."          (for API call)
 */

/**
 * DEBUGGING TIPS:
 * ---------------
 */
function debugImageFormat(base64String) {
    console.log('String length:', base64String.length);
    console.log('Starts with data URI?', base64String.startsWith('data:'));
    console.log('First 100 chars:', base64String.substring(0, 100));
    
    if (base64String.startsWith('data:')) {
        console.warn('⚠️ WARNING: String has data URI prefix - will cause API error!');
        console.log('✅ Use removeBase64Prefix() to fix');
    } else {
        console.log('✅ Clean base64 - ready for API');
    }
}

/**
 * TESTING:
 * --------
 */
function testRemovePrefix() {
    // Test 1: JPEG
    const jpeg = "data:image/jpeg;base64,ABC123";
    console.assert(removeBase64Prefix(jpeg) === "ABC123", "JPEG prefix removal failed");
    
    // Test 2: PNG
    const png = "data:image/png;base64,XYZ789";
    console.assert(removeBase64Prefix(png) === "XYZ789", "PNG prefix removal failed");
    
    // Test 3: WEBP
    const webp = "data:image/webp;base64,DEF456";
    console.assert(removeBase64Prefix(webp) === "DEF456", "WEBP prefix removal failed");
    
    // Test 4: Already clean
    const clean = "GHI789";
    console.assert(removeBase64Prefix(clean) === "GHI789", "Clean string should remain unchanged");
    
    console.log('✅ All tests passed!');
}

export {
    example1_removePrefix,
    example2_processImageFromFile,
    example3_completeHandler,
    debugImageFormat,
    testRemovePrefix
};
