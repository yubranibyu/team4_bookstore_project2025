const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all stores
const getAll = async (req, res) => {
  // #swagger.tags=['Stores']
  try {
    const db = mongodb.getDB();
    const stores = await db.collection('stores').find().toArray();
    res.status(200).json(stores);
  } catch (err) {
    console.error('Failed obtaining stores:', err);
    res.status(500).json({ error: 'Failed obtaining stores' });
  }
};

// GET single store
const getSingle = async (req, res) => {
  // #swagger.tags=['Stores']
  try {
    const storeId = req.params.id;
    if (!ObjectId.isValid(storeId)) return res.status(400).json({ error: 'Invalid store ID' });

    const db = mongodb.getDB();
    const store = await db.collection('stores').findOne({ _id: new ObjectId(storeId) });

    if (!store) return res.status(404).json({ error: 'Store not found' });

    res.status(200).json(store);
  } catch (err) {
    console.error('Failed obtaining store:', err);
    res.status(500).json({ error: 'Failed obtaining store' });
  }
};

// CREATE a new store
const createStore = async (req, res) => {
  // #swagger.tags=['Stores']
  try {
    const { location, owner } = req.body;

    if (!location || typeof location !== 'string') {
      return res.status(400).json({ error: 'location is required and must be a string' });
    }
    if (!owner || typeof owner !== 'string') {
      return res.status(400).json({ error: 'owner is required and must be a string' });
    }

    const store = { location, owner };
    const db = mongodb.getDB();
    const response = await db.collection('stores').insertOne(store);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Could not create store' });
    }

    res.status(201).json({ message: 'Store created successfully', id: response.insertedId });
  } catch (err) {
    console.error('Error while creating store:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE a store
const updateStore = async (req, res) => {
  // #swagger.tags=['Stores']
  try {
    const storeId = req.params.id;
    if (!ObjectId.isValid(storeId)) return res.status(400).json({ error: 'Invalid store ID' });

    const { location, owner } = req.body;
    const storeUpdate = {};
    if (location) storeUpdate.location = location;
    if (owner) storeUpdate.owner = owner;

    const db = mongodb.getDB();
    const response = await db.collection('stores').updateOne(
      { _id: new ObjectId(storeId) },
      { $set: storeUpdate }
    );

    if (response.matchedCount === 0) return res.status(404).json({ error: 'Store not found' });

    res.status(204).send();
  } catch (err) {
    console.error('Error while updating store:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a store
const deleteStore = async (req, res) => {
  // #swagger.tags=['Stores']
  try {
    const storeId = req.params.id;
    if (!ObjectId.isValid(storeId)) return res.status(400).json({ error: 'Invalid store ID' });

    const db = mongodb.getDB();
    const response = await db.collection('stores').deleteOne({ _id: new ObjectId(storeId) });

    if (response.deletedCount === 0) return res.status(404).json({ error: 'Store not found' });

    res.status(204).send();
  } catch (err) {
    console.error('Error while deleting store:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createStore,
  updateStore,
  deleteStore
};
