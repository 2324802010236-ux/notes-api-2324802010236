const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('Chua cau hinh MONGODB_URI');
  }

  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(uri, {
    dbName: 'notes',
    serverSelectionTimeoutMS: 5000
  });

  console.log('Đã kết nối MongoDB Atlas');
  console.log('Database:', mongoose.connection.name);
}

module.exports = { connectDB };
