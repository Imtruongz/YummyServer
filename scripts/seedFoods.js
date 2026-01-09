/**
 * Seed Foods Script
 * Import food data from JSON file into MongoDB
 * 
 * Usage: node scripts/seedFoods.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Food } from '../Models/foods.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedFoods = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI || process.env.MONGO_URL;
        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables');
        }
        await mongoose.connect(mongoUri, { dbName: "Yummy" });
        console.log('✅ Connected to MongoDB\n');

        // Read JSON file
        console.log('📖 Reading JSON file...');
        const jsonPath = path.join(__dirname, '..', 'data', 'vietnamese-foods.json');

        if (!fs.existsSync(jsonPath)) {
            throw new Error(`File not found: ${jsonPath}`);
        }

        const jsonData = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(jsonData);

        if (!data.foods || !Array.isArray(data.foods)) {
            throw new Error('Invalid JSON format. Expected { foods: [] }');
        }

        console.log(`📊 Found ${data.foods.length} foods to import\n`);

        // Validate that categoryId and userId are filled
        const hasPlaceholder = data.foods.some(food =>
            food.categoryId.includes('REPLACE_WITH') ||
            food.userId.includes('REPLACE_WITH')
        );

        if (hasPlaceholder) {
            console.log('⚠️  WARNING: Found placeholder IDs in JSON');
            console.log('❌ Please run: node scripts/getIds.js');
            console.log('❌ Then replace REPLACE_WITH_CATEGORY_ID and REPLACE_WITH_USER_ID in data/vietnamese-foods.json');
            process.exit(1);
        }

        // Import foods
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 0; i < data.foods.length; i++) {
            const foodData = data.foods[i];

            try {
                // Check if food already exists
                const existing = await Food.findOne({
                    foodName: foodData.foodName,
                    userId: foodData.userId
                });

                if (existing) {
                    console.log(`⏭️  [${i + 1}/${data.foods.length}] Skipped: "${foodData.foodName}" (already exists)`);
                    continue;
                }

                // Create new food
                const newFood = new Food({
                    ...foodData,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                await newFood.save();
                successCount++;
                console.log(`✅ [${i + 1}/${data.foods.length}] Imported: "${foodData.foodName}"`);

            } catch (error) {
                errorCount++;
                errors.push({ food: foodData.foodName, error: error.message });
                console.log(`❌ [${i + 1}/${data.foods.length}] Failed: "${foodData.foodName}" - ${error.message}`);
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 IMPORT SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Successfully imported: ${successCount} foods`);
        console.log(`❌ Failed: ${errorCount} foods`);
        console.log(`📝 Total in JSON: ${data.foods.length} foods`);

        if (errors.length > 0) {
            console.log('\n❌ ERRORS:');
            errors.forEach(({ food, error }) => {
                console.log(`  - ${food}: ${error}`);
            });
        }

        if (successCount > 0) {
            console.log('\n🎉 Import completed successfully!');
            console.log('💡 You can now refresh your app to see the new foods');
        }

    } catch (error) {
        console.error('\n❌ Fatal Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

seedFoods();
