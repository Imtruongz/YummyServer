/**
 * Migration Script: Convert external URLs to Cloudinary
 * 
 * This script will migrate images from external URLs (like Unsplash, etc.)
 * to Cloudinary for better control and performance.
 * 
 * Run: node scripts/migrate-urls-to-cloudinary.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { uploadImage } from '../Config/cloudinaryConfig.js';

dotenv.config({ path: './.env' });

const MONGO_URL = process.env.MONGO_URL;

// Track progress
let stats = {
    foods: { total: 0, migrated: 0, skipped: 0, failed: 0 },
    users: { total: 0, migrated: 0, skipped: 0, failed: 0 }
};

// Check if URL is from Cloudinary (already migrated)
const isCloudinaryUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.includes('cloudinary.com');
};

// Check if URL is external (not Cloudinary, not base64)
const isExternalUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    return url.startsWith('http') && !isCloudinaryUrl(url);
};

// Migrate food thumbnails with external URLs
async function migrateFoodUrls() {
    console.log('\n📦 Migrating Food Thumbnails (External URLs)...\n');

    const foods = await mongoose.connection.db.collection('foods').find({}).toArray();
    stats.foods.total = foods.length;

    for (const food of foods) {
        try {
            // Skip if not an external URL
            if (!isExternalUrl(food.foodThumbnail)) {
                console.log(`⏭️  [${food.foodName}] Already on Cloudinary or no thumbnail`);
                stats.foods.skipped++;
                continue;
            }

            console.log(`📤 [${food.foodName}] Uploading from: ${food.foodThumbnail.substring(0, 50)}...`);

            // Upload to Cloudinary (Cloudinary accepts URLs)
            const result = await uploadImage(food.foodThumbnail, 'yummy/foods');

            // Update database
            await mongoose.connection.db.collection('foods').updateOne(
                { _id: food._id },
                {
                    $set: {
                        foodThumbnail: result.url,
                        cloudinaryPublicId: result.publicId,
                        originalUrl: food.foodThumbnail // Keep original URL for reference
                    }
                }
            );

            console.log(`✅ [${food.foodName}] Done! New URL: ${result.url.substring(0, 60)}...`);
            stats.foods.migrated++;

        } catch (error) {
            console.error(`❌ [${food.foodName}] Failed:`, error.message);
            stats.foods.failed++;
        }
    }
}

// Migrate user avatars with external URLs
async function migrateUserUrls() {
    console.log('\n👤 Migrating User Avatars (External URLs)...\n');

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    stats.users.total = users.length;

    for (const user of users) {
        try {
            // Skip if not an external URL
            if (!isExternalUrl(user.avatar)) {
                console.log(`⏭️  [${user.username}] Already on Cloudinary or no avatar`);
                stats.users.skipped++;
                continue;
            }

            console.log(`📤 [${user.username}] Uploading from: ${user.avatar.substring(0, 50)}...`);

            // Upload to Cloudinary
            const result = await uploadImage(user.avatar, 'yummy/avatars');

            // Update database
            await mongoose.connection.db.collection('users').updateOne(
                { _id: user._id },
                {
                    $set: {
                        avatar: result.url,
                        avatarPublicId: result.publicId,
                        originalAvatarUrl: user.avatar // Keep original for reference
                    }
                }
            );

            console.log(`✅ [${user.username}] Done! New URL: ${result.url.substring(0, 60)}...`);
            stats.users.migrated++;

        } catch (error) {
            console.error(`❌ [${user.username}] Failed:`, error.message);
            stats.users.failed++;
        }
    }
}

// Print summary
function printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 URL MIGRATION SUMMARY');
    console.log('='.repeat(50));

    console.log('\n🍔 Foods:');
    console.log(`   Total: ${stats.foods.total}`);
    console.log(`   ✅ Migrated: ${stats.foods.migrated}`);
    console.log(`   ⏭️  Skipped: ${stats.foods.skipped}`);
    console.log(`   ❌ Failed: ${stats.foods.failed}`);

    console.log('\n👤 Users:');
    console.log(`   Total: ${stats.users.total}`);
    console.log(`   ✅ Migrated: ${stats.users.migrated}`);
    console.log(`   ⏭️  Skipped: ${stats.users.skipped}`);
    console.log(`   ❌ Failed: ${stats.users.failed}`);

    console.log('\n' + '='.repeat(50));
}

// Main function
async function main() {
    console.log('🚀 Starting URL to Cloudinary Migration...\n');

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URL, { dbName: 'Yummy' });
        console.log('✅ Connected to MongoDB\n');

        // Run migrations
        await migrateFoodUrls();
        await migrateUserUrls();

        // Print summary
        printSummary();

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

// Run
main();
