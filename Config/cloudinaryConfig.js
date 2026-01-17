import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/**
 * Upload image to Cloudinary
 * @param {string} imageData - Base64 string or URL
 * @param {string} folder - Folder name in Cloudinary (e.g., 'foods', 'avatars')
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (imageData, folder = 'yummy', publicId = null) => {
    try {
        const uploadOptions = {
            folder: folder,
            resource_type: 'image',
            transformation: [
                { width: 800, height: 800, crop: 'limit' }, // Limit max size
                { quality: 'auto:good' }, // Auto optimize quality
                { fetch_format: 'auto' } // Auto format (webp, etc.)
            ]
        };

        if (publicId) {
            uploadOptions.public_id = publicId;
            uploadOptions.overwrite = true;
        }

        const result = await cloudinary.uploader.upload(imageData, uploadOptions);

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image: ' + error.message);
    }
};

/**
 * Upload multiple images
 * @param {string[]} images - Array of base64 strings or URLs
 * @param {string} folder - Folder name
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
export const uploadMultipleImages = async (images, folder = 'yummy') => {
    try {
        const uploadPromises = images.map(image => uploadImage(image, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw new Error('Failed to upload images: ' + error.message);
    }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image: ' + error.message);
    }
};

/**
 * Get optimized URL for an existing image
 * @param {string} publicId - The public ID
 * @param {object} options - Transformation options
 * @returns {string}
 */
export const getOptimizedUrl = (publicId, options = {}) => {
    const defaultOptions = {
        width: options.width || 400,
        height: options.height || 400,
        crop: options.crop || 'fill',
        quality: 'auto',
        fetch_format: 'auto'
    };

    return cloudinary.url(publicId, defaultOptions);
};

export default cloudinary;
