/**
 * Check existing foods in database
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Food } from '../Models/foods.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const checkFoods = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI || process.env.MONGO_URL;
        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables');
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Get all foods
        const foods = await Food.find({}).select('foodName userId categoryId').lean();

        console.log(`📊 Total foods in database: ${foods.length}\n`);

        if (foods.length === 0) {
            console.log('❌ No foods found in database!');
        } else {
            // Group by userId
            const groupedByUser = {};
            foods.forEach(food => {
                if (!groupedByUser[food.userId]) {
                    groupedByUser[food.userId] = [];
                }
                groupedByUser[food.userId].push(food.foodName);
            });

            console.log('📋 Foods grouped by User:\n');
            console.log('='.repeat(80));
            Object.keys(groupedByUser).forEach((userId, index) => {
                console.log(`\n👤 User ${index + 1}: ${userId}`);
                console.log(`   Total: ${groupedByUser[userId].length} món`);
                console.log('   Foods:');
                groupedByUser[userId].forEach((name, i) => {
                    console.log(`      ${i + 1}. ${name}`);
                });
            });
            console.log('\n' + '='.repeat(80));
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

checkFoods();
