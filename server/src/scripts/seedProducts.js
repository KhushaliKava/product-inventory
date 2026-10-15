import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';

const sampleProducts = [
  {
    name: 'Pro Wireless Noise-Cancelling Headphones',
    description: 'Engineered with custom 40mm drivers and active noise cancellation for pristine acoustic depth. Features 38 hours of battery life and plush memory foam ear cushions.',
    price: 349.99,
    stock: 24, // In stock
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Ultra-Slim Mechanical Keyboard RGB',
    description: 'Hot-swappable tactile switches with aircraft-grade aluminum chassis. Per-key RGB backlighting and Bluetooth 5.2 multi-device pairing.',
    price: 159.00,
    stock: 7, // Low stock
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Curved OLED Gaming Monitor 34"',
    description: 'Widescreen 175Hz refresh rate with 0.03ms response time. Quantum Dot OLED panel delivering infinite contrast and 99.3% DCI-P3 color gamut.',
    price: 899.99,
    stock: 0, // Out of stock
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Titanium Smart Watch Series 8',
    description: 'Aerospace-grade titanium housing with sapphire crystal glass. Advanced ECG tracking, blood oxygen monitoring, dual-frequency GPS, and always-on display.',
    price: 499.50,
    stock: 18, // In stock
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Ergonomic Mesh Executive Chair',
    description: 'Dynamic lumbar support with adjustable 4D armrests, breathable elastomeric mesh, and 135-degree recline with weight-activated tension control.',
    price: 420.00,
    stock: 4, // Low stock
    category: 'Home Office',
    image: 'https://images.unsplash.com/photo-1580481077195-c328a3727377?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Studio Condenser USB-C Microphone',
    description: '24-bit/192kHz high-resolution recording with selectable cardioid and omni polar patterns. Built-in headphone jack with zero-latency monitoring.',
    price: 129.99,
    stock: 15, // In stock
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Precision Wireless Ergonomic Mouse',
    description: 'MagSpeed electromagnetic scrolling with 8000 DPI sensor capable of tracking on glass. USB-C quick charge provides 70 days of battery life.',
    price: 99.99,
    stock: 32, // In stock
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Smart Ambient LED Light Bar Duo',
    description: 'Immersive screen sync illumination with 16 million colors, voice control compatibility, and flexible desktop mounting brackets.',
    price: 79.95,
    stock: 2, // Low stock
    category: 'Home Office',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Portable 100W GaN Fast Charger',
    description: 'Compact 4-port fast charger with 3x USB-C and 1x USB-A ports. Powered by Gallium Nitride (GaN) technology for intelligent thermal distribution.',
    price: 64.99,
    stock: 0, // Out of stock
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Leather Minimalist Tech Organizer Case',
    description: 'Full-grain top leather with water-resistant YKK zippers and modular elastic loops for cables, power banks, pens, and flash drives.',
    price: 45.00,
    stock: 19, // In stock
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'High-Fidelity Bluetooth Speaker 40W',
    description: 'Dual passive radiators delivering deep bass with IPX7 waterproof rating, 24-hour battery life, and party-link synchronization.',
    price: 119.00,
    stock: 12, // In stock
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Smart Fitness Tracker Band with Heart Rate Monitor',
    description: 'Vibrant AMOLED touchscreen with continuous heart rate, sleep stage tracking, 30+ workout modes, and 14 days standby battery.',
    price: 59.99,
    stock: 8, // Low stock
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&auto=format&fit=crop&q=80'
  }
];

const seedProducts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product_inventory';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Creating default admin first...');
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Super Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim(),
        password: process.env.ADMIN_PASSWORD || 'change_me_strong_password',
        role: 'admin'
      });
    }

    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`Inventory already has ${existingCount} products. Skipping initial seed.`);
      process.exit(0);
    }

    const productsWithUser = sampleProducts.map((p) => ({
      ...p,
      createdBy: admin._id
    }));

    await Product.insertMany(productsWithUser);
    console.log(`✅ Successfully seeded ${sampleProducts.length} high-quality products into inventory!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();
