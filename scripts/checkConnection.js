/**
 * Check MongoDB connection and database info
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const checkConnection = async () => {
    try {
        console.log('🔗 Connecting to MongoDB...');
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URI || process.env.MONGO_URL;

        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables');
        }

        console.log(`📡 MongoDB URI: ${mongoUri}\n`);

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Get connection info
        const db = mongoose.connection.db;
        const dbName = db.databaseName;

        console.log('='.repeat(80));
        console.log('📊 DATABASE INFO');
        console.log('='.repeat(80));
        console.log(`Database Name: ${dbName}`);
        console.log('');

        // List all collections
        const collections = await db.listCollections().toArray();
        console.log(`Total Collections: ${collections.length}\n`);

        console.log('📂 Collections:');
        console.log('-'.repeat(80));

        for (const collection of collections) {
            const collectionName = collection.name;
            const count = await db.collection(collectionName).countDocuments();
            console.log(`  • ${collectionName.padEnd(30)} → ${count} documents`);
        }

        console.log('='.repeat(80));

        // Check foods collection specifically
        console.log('\n🍜 FOODS Collection Details:');
        console.log('-'.repeat(80));

        const foodsCount = await db.collection('foods').countDocuments();
        console.log(`Total foods: ${foodsCount}`);

        if (foodsCount > 0) {
            // Get sample food
            const sampleFood = await db.collection('foods').findOne();
            console.log('\n📋 Sample Food Document:');
            console.log(JSON.stringify(sampleFood, null, 2));
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

checkConnection();
