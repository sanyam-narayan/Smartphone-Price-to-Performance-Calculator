require('dotenv').config();
const mongoose = require('mongoose');
const Phone = require('./models/Phone');

const phones = [
  { name: "Moto G86 Power",        price: 16999, antutu: 480000, ram: 8, storage: 128, battery: 6720, refreshRate: 120, cameraMP: 50 },
  { name: "Redmi Note 14",         price: 17999, antutu: 500000, ram: 8, storage: 128, battery: 5500, refreshRate: 120, cameraMP: 108 },
  { name: "Realme 14x",            price: 14999, antutu: 460000, ram: 6, storage: 128, battery: 6000, refreshRate: 120, cameraMP: 50 },
  { name: "Poco M7 Pro",           price: 13999, antutu: 470000, ram: 8, storage: 128, battery: 5110, refreshRate: 120, cameraMP: 50 },
  { name: "Samsung Galaxy M35",    price: 18999, antutu: 430000, ram: 8, storage: 128, battery: 6000, refreshRate: 120, cameraMP: 50 },
  { name: "iQOO Z9x",              price: 14999, antutu: 590000, ram: 8, storage: 128, battery: 6000, refreshRate: 120, cameraMP: 50 },
  { name: "Vivo T3x",              price: 13999, antutu: 480000, ram: 8, storage: 128, battery: 6000, refreshRate: 120, cameraMP: 50 },
  { name: "OnePlus Nord CE4 Lite", price: 19999, antutu: 460000, ram: 8, storage: 128, battery: 5500, refreshRate: 120, cameraMP: 50 },
  { name: "Motorola Edge 50 Fusion", price: 22999, antutu: 550000, ram: 8, storage: 128, battery: 5000, refreshRate: 144, cameraMP: 50 },
  { name: "Redmi 14C",             price: 9999,  antutu: 300000, ram: 4, storage: 128, battery: 5160, refreshRate: 90,  cameraMP: 32 },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spec_rs_phone_index';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await Phone.deleteMany({});
    console.log('Cleared existing phones');

    await Phone.insertMany(phones);
    console.log(`Inserted ${phones.length} phones successfully`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seed();
