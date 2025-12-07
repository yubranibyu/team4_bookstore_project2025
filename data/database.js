const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let db;
let client;

const initDB = async (callback) => {
  if (db) {
    console.log('Database is already initialized!');
    return callback(null, db);
  }

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db(); // default DB from URI
    console.log('Connected to MongoDB');
    callback(null, db);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    callback(err);
  }
};

const getDB = () => {
  if (!db) throw new Error('Database is not initialized');
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = { initDB, getDB, closeDB };
