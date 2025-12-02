// imageUtils.js - Image handling utility functions

/**
 * Remove data URI prefix from base64 string
 * @param {string} base64String - Base64 string with or without prefix
 * @returns {string} Clean base64 string without prefix
 */
export const removeBase64Prefix = (base64String) => {
    if (!base64String) return '';
    
    // Remove data URI prefix if present
    // Format: "data:image/jpeg;base64,ACTUALBASE64DATA"
    const prefixPattern = /^data:image\/[a-zA-Z]+;base64,/;
    
    if (prefixPattern.test(base64String)) {
        return base64String.replace(prefixPattern, '');
    }
    
    return base64String;
};

/**
 * Convert image file to base64 string (with data URI prefix for preview)
 * @param {File} file - Image file object
 * @returns {Promise<string>} Base64 encoded string with data URI
 */
export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = (error) => {
            reject(new Error('Error reading file: ' + error.message));
        };
        
        reader.readAsDataURL(file);
    });
};

/**
 * Process image for API - convert to clean base64 without prefix
 * @param {File} file - Image file object
 * @returns {Promise<string>} Clean base64 string without data URI prefix
 */
export const processImageForAPI = async (file) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // First convert to base64 with prefix
        const base64WithPrefix = await convertToBase64(file);
        
        // Remove the data URI prefix for API
        const cleanBase64 = removeBase64Prefix(base64WithPrefix);
        
        return cleanBase64;
    } catch (error) {
        throw new Error('Error processing image for API: ' + error.message);
    }
};

/**
 * Compress image before uploading
 * @param {File} file - Image file object
 * @param {number} maxWidth - Maximum width for compressed image
 * @returns {Promise<string>} Compressed base64 string
 */
export const compressImage = (file, maxWidth = 1024) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions maintaining aspect ratio
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with quality compression
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(compressedBase64);
            };
            
            img.onerror = () => {
                reject(new Error('Error loading image for compression'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            reject(new Error('Error reading file for compression'));
        };
        
        reader.readAsDataURL(file);
    });
};

/**
 * Validate image file
 * @param {File} file - Image file object
 * @returns {Object} Validation result { valid: boolean, error: string }
 */
export const validateImage = (file) => {
    if (!file) {
        return { valid: false, error: 'ದಯವಿಟ್ಟು ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ' };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { 
            valid: false, 
            error: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಚಿತ್ರ ಫೈಲ್ ಅನ್ನು ಆಯ್ಕೆಮಾಡಿ (JPEG, PNG, WEBP)' 
        };
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return { 
            valid: false, 
            error: 'ಚಿತ್ರ ಗಾತ್ರವು 5MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು' 
        };
    }
    
    return { valid: true, error: null };
};

/**
 * Get image dimensions
 * @param {File} file - Image file object
 * @returns {Promise<Object>} { width: number, height: number }
 */
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };
            
            img.onerror = () => {
                reject(new Error('Error loading image to get dimensions'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            reject(new Error('Error reading file to get dimensions'));
        };
        
        reader.readAsDataURL(file);
    });
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
