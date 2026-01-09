/**
 * Helper script to get CategoryIds and UserIds from database
 * Run: node scripts/getIds.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../Models/users.js';
import { Category } from '../Models/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const getIds = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables');
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Get all categories
        console.log('📂 CATEGORIES:');
        console.log('='.repeat(50));
        const categories = await Category.find().select('categoryId categoryName').lean();
        if (categories.length === 0) {
            console.log('⚠️  No categories found. Please create categories first.');
        } else {
            categories.forEach(cat => {
                console.log(`  ${cat.categoryName.padEnd(30)} → ${cat.categoryId}`);
            });
        }

        // Get all users
        console.log('\n👥 USERS:');
        console.log('='.repeat(50));
        const users = await User.find().select('userId username email').limit(10).lean();
        if (users.length === 0) {
            console.log('⚠️  No users found. Please create users first.');
        } else {
            users.forEach(user => {
                console.log(`  ${user.username.padEnd(20)} (${user.email.padEnd(30)}) → ${user.userId}`);
            });
        }

        console.log('\n📋 INSTRUCTIONS:');
        console.log('='.repeat(50));
        console.log('1. Copy a categoryId from above');
        console.log('2. Copy a userId from above');
        console.log('3. Update data/vietnamese-foods.json with these IDs');
        console.log('4. Run: node scripts/seedFoods.js');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

getIds();
