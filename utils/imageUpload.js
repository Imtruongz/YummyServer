/**
 * Image Upload Utility
 * Detects base64 images and uploads them to Cloudinary automatically
 */

import { uploadImage } from '../Config/cloudinaryConfig.js';

/**
 * Check if a string is a base64 image
 * @param {string} str - String to check
 * @returns {boolean}
 */
export const isBase64Image = (str) => {
    if (!str || typeof str !== 'string') return false;
    return str.startsWith('data:image');
};

/**
 * Check if a string is already a Cloudinary URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
export const isCloudinaryUrl = (str) => {
    if (!str || typeof str !== 'string') return false;
    return str.includes('cloudinary.com');
};

/**
 * Check if a string is a regular URL (not base64)
 * @param {string} str - String to check
 * @returns {boolean}
 */
export const isUrl = (str) => {
    if (!str || typeof str !== 'string') return false;
    return str.startsWith('http://') || str.startsWith('https://');
};

/**
 * Process image - if base64, upload to Cloudinary and return URL
 * If already URL, return as-is
 * 
 * @param {string} imageData - Base64 string or URL
 * @param {string} folder - Folder in Cloudinary (e.g., 'yummy/foods', 'yummy/avatars')
 * @returns {Promise<string>} - Cloudinary URL or original URL
 */
export const processImage = async (imageData, folder = 'yummy') => {
    // If no image data, return empty string
    if (!imageData) {
        return '';
    }

    // If already a Cloudinary URL, return as-is
    if (isCloudinaryUrl(imageData)) {
        console.log(`📷 [processImage] Already Cloudinary URL, skipping upload`);
        return imageData;
    }

    // If it's a regular URL (not base64), return as-is
    if (isUrl(imageData) && !isBase64Image(imageData)) {
        console.log(`📷 [processImage] External URL, skipping upload`);
        return imageData;
    }

    // If it's a base64 image, upload to Cloudinary
    if (isBase64Image(imageData)) {
        console.log(`📷 [processImage] Base64 detected, uploading to Cloudinary...`);
        try {
            const result = await uploadImage(imageData, folder);
            console.log(`✅ [processImage] Uploaded successfully: ${result.url.substring(0, 60)}...`);
            return result.url;
        } catch (error) {
            console.error(`❌ [processImage] Upload failed:`, error.message);
            // Return original data if upload fails (fallback)
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    }

    // Unknown format, return as-is
    console.log(`⚠️ [processImage] Unknown format, returning as-is`);
    return imageData;
};

/**
 * Process food thumbnail - convenience wrapper
 * @param {string} thumbnail - Base64 or URL
 * @returns {Promise<string>}
 */
export const processFoodThumbnail = async (thumbnail) => {
    return processImage(thumbnail, 'yummy/foods');
};

/**
 * Process user avatar - convenience wrapper
 * @param {string} avatar - Base64 or URL
 * @returns {Promise<string>}
 */
export const processUserAvatar = async (avatar) => {
    return processImage(avatar, 'yummy/avatars');
};
