import mongoose from 'mongoose';
import { EmailVerification } from '../Models/emailVerification.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
    
    console.log('Dropping old userId_1 index...');
    await EmailVerification.collection.dropIndex('userId_1').catch(() => {
      console.log('ℹ️  Index does not exist or already dropped');
    });
    
    console.log('✅ Index fixed! You can now register users without E11000 errors.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixIndex();
