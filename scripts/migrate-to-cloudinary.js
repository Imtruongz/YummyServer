/**
 * Migration Script: Convert base64 images to Cloudinary URLs
 * 
 * This script will:
 * 1. Find all foods with base64 foodThumbnail
 * 2. Upload each image to Cloudinary
 * 3. Update the database with the new URL
 * 4. Do the same for user avatars
 * 
 * Run: node scripts/migrate-to-cloudinary.js
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

// Check if string is base64
const isBase64 = (str) => {
    if (!str || typeof str !== 'string') return false;
    return str.startsWith('data:image') ||
        (str.length > 500 && !str.startsWith('http'));
};

// Migrate food thumbnails
async function migrateFoodThumbnails() {
    console.log('\n📦 Migrating Food Thumbnails...\n');

    const foods = await mongoose.connection.db.collection('foods').find({}).toArray();
    stats.foods.total = foods.length;

    for (const food of foods) {
        try {
            // Skip if already a URL
            if (!isBase64(food.foodThumbnail)) {
                console.log(`⏭️  [${food.foodName}] Already migrated or no thumbnail`);
                stats.foods.skipped++;
                continue;
            }

            console.log(`📤 [${food.foodName}] Uploading...`);

            // Upload to Cloudinary
            const result = await uploadImage(food.foodThumbnail, 'yummy/foods');

            // Update database
            await mongoose.connection.db.collection('foods').updateOne(
                { _id: food._id },
                {
                    $set: {
                        foodThumbnail: result.url,
                        cloudinaryPublicId: result.publicId
                    }
                }
            );

            console.log(`✅ [${food.foodName}] Done! URL: ${result.url.substring(0, 60)}...`);
            stats.foods.migrated++;

        } catch (error) {
            console.error(`❌ [${food.foodName}] Failed:`, error.message);
            stats.foods.failed++;
        }
    }
}

// Migrate user avatars
async function migrateUserAvatars() {
    console.log('\n👤 Migrating User Avatars...\n');

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    stats.users.total = users.length;

    for (const user of users) {
        try {
            // Skip if no avatar or already a URL
            if (!user.avatar || !isBase64(user.avatar)) {
                console.log(`⏭️  [${user.username}] Already migrated or no avatar`);
                stats.users.skipped++;
                continue;
            }

            console.log(`📤 [${user.username}] Uploading avatar...`);

            // Upload to Cloudinary
            const result = await uploadImage(user.avatar, 'yummy/avatars');

            // Update database
            await mongoose.connection.db.collection('users').updateOne(
                { _id: user._id },
                {
                    $set: {
                        avatar: result.url,
                        avatarPublicId: result.publicId
                    }
                }
            );

            console.log(`✅ [${user.username}] Done! URL: ${result.url.substring(0, 60)}...`);
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
    console.log('📊 MIGRATION SUMMARY');
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
    console.log('🚀 Starting Cloudinary Migration...\n');

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URL, { dbName: 'Yummy' });
        console.log('✅ Connected to MongoDB\n');

        // Run migrations
        await migrateFoodThumbnails();
        await migrateUserAvatars();

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
