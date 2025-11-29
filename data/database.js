const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let db;

const initDB = (callback) => {
  if (db) {
    console.log('Database is already initialized!');
    return callback(null, db);
  }

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      db = client.db(); // ⭐ Ya no es necesario poner 'BooksInventory'
      console.log('🚀 Connected to MongoDB');
      callback(null, db);
    })
    .catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err);
      callback(err);
    });
};

const getDB = () => {
  if (!db) {
    throw new Error('Database is not initialized');
  }
  return db;
};

module.exports = { initDB, getDB };
