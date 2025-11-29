const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //  #swagger.tags=['Stores']
  try {
    const db = mongodb.getDB();
    const stores = await db.collection('stores').find().toArray();
    res.status(200).json(stores);
  } catch (err) {
    console.error('Failed obtaining stores:', err);
    res.status(500).json({ error: 'Failed obtaining stores' });
  }
};

const getSingle = async (req, res) => {
  //  #swagger.tags=['Stores']
  try {
    const storeId = new ObjectId(req.params.id);
    const db = mongodb.getDB();
    const store = await db.collection('stores').findOne({ _id: storeId });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.status(200).json(store);
  } catch (err) {
    console.error('Failed obtaining store:', err);
    res.status(500).json({ error: 'Failed obtaining store' });
  }
};

const createStore = async (req, res) => {
  //  #swagger.tags=['Stores']

  const store = {
    name: req.body.name,
    location: req.body.location,
    phone: req.body.phone,
    email: req.body.email,
    openingHours: req.body.openingHours,
    booksAvailable: req.body.booksAvailable // puede ser un número o un array de ObjectId
  };

  try {
    const response = await mongodb.getDB().collection('stores').insertOne(store);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Store created successfully', id: response.insertedId });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the store.');
    }
  } catch (err) {
    console.error('Error while creating the store:', err);
    res.status(500).json({ error: 'Error while creating the store.' });
  }
};

const updateStore = async (req, res) => {
  //  #swagger.tags=['Stores']
  const storeId = new ObjectId(req.params.id);
  const store = {
    name: req.body.name,
    location: req.body.location,
    phone: req.body.phone,
    email: req.body.email,
    openingHours: req.body.openingHours,
    booksAvailable: req.body.booksAvailable
  };

  try {
    const response = await mongodb.getDB().collection('stores').replaceOne({ _id: storeId }, store);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the store.');
    }
  } catch (err) {
    console.error('Error while updating the store:', err);
    res.status(500).json({ error: 'Error while updating the store.' });
  }
};

const deleteStore = async (req, res) => {
  //  #swagger.tags=['Stores']
  const storeId = new ObjectId(req.params.id);
  try {
    const response = await mongodb.getDB().collection('stores').deleteOne({ _id: storeId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the store.');
    }
  } catch (err) {
    console.error('Error while deleting the store:', err);
    res.status(500).json({ error: 'Error while deleting the store.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createStore,
  updateStore,
  deleteStore
};
