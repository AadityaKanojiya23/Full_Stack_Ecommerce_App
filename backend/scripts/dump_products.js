import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config({ path: '../.env' });

const dump = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://amore_admin:AmoreCake%23Mongo2026@cluster0.1ynk8f6.mongodb.net/sweetcrave?retryWrites=true&w=majority&appName=Cluster0';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  const products = await Product.find({});
  console.log('Total products:', products.length);
  products.forEach(p => {
    console.log(`- ID: ${p._id}, Name: "${p.name}", Category: "${p.category}", Price: ${p.price}`);
  });
  process.exit(0);
};

dump().catch(err => {
  console.error(err);
  process.exit(1);
});
