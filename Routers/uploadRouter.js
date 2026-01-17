import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../Config/cloudinaryConfig.js';
import { authenticateToken } from '../Config/jwtConfig.js';

const router = express.Router();

/**
 * POST /api/upload/image
 * Upload a single image to Cloudinary
 * Body: { image: "base64_string", folder: "foods" | "avatars" }
 */
router.post('/image', authenticateToken, async (req, res) => {
    try {
        const { image, folder = 'yummy' } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Validate base64 or URL
        if (!image.startsWith('data:image') && !image.startsWith('http')) {
            return res.status(400).json({ message: 'Invalid image format. Must be base64 or URL' });
        }

        const result = await uploadImage(image, folder);

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.url,
                publicId: result.publicId
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * POST /api/upload/images
 * Upload multiple images to Cloudinary
 * Body: { images: ["base64_string1", "base64_string2"], folder: "foods" }
 */
router.post('/images', authenticateToken, async (req, res) => {
    try {
        const { images, folder = 'yummy' } = req.body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: 'Images array is required' });
        }

        if (images.length > 10) {
            return res.status(400).json({ message: 'Maximum 10 images allowed per request' });
        }

        const results = await uploadMultipleImages(images, folder);

        res.json({
            success: true,
            message: `${results.length} images uploaded successfully`,
            data: results
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * DELETE /api/upload/image/:publicId
 * Delete an image from Cloudinary
 */
router.delete('/image/:publicId', authenticateToken, async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({ message: 'Public ID is required' });
        }

        // Decode the publicId (it may contain slashes encoded as %2F)
        const decodedPublicId = decodeURIComponent(publicId);

        const success = await deleteImage(decodedPublicId);

        if (success) {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(404).json({ message: 'Image not found or already deleted' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
