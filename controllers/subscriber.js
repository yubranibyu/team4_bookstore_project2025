const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //  #swagger.tags=['Subscribers']
  try {
    const db = mongodb.getDB();
    const subscribers = await db.collection('subscribers').find().toArray();
    res.status(200).json(subscribers);
  } catch (err) {
    console.error('Failed obtaining subscribers:', err);
    res.status(500).json({ error: 'Failed obtaining subscribers' });
  }
};

const getSingle = async (req, res) => {
  //  #swagger.tags=['Subscribers']
  try {
    const subscriberId = new ObjectId(req.params.id);
    const db = mongodb.getDB();
    const subscriber = await db.collection('subscribers').findOne({ _id: subscriberId });

    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }

    res.status(200).json(subscriber);
  } catch (err) {
    console.error('Failed obtaining subscriber:', err);
    res.status(500).json({ error: 'Failed obtaining subscriber' });
  }
};

const createSubscriber = async (req, res) => {
  //  #swagger.tags=['Subscribers']
  const subscriber = {
    name: req.body.name,
    email: req.body.email,
    subscribedAt: req.body.subscribedAt || new Date(),
    status: req.body.status || 'active' // optional: active / inactive
  };

  try {
    const response = await mongodb.getDB().collection('subscribers').insertOne(subscriber);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Subscriber created successfully', id: response.insertedId });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the subscriber.');
    }
  } catch (err) {
    console.error('Error while creating the subscriber:', err);
    res.status(500).json({ error: 'Error while creating the subscriber.' });
  }
};

const updateSubscriber = async (req, res) => {
  //  #swagger.tags=['Subscribers']
  const subscriberId = new ObjectId(req.params.id);
  const subscriber = {
    name: req.body.name,
    email: req.body.email,
    subscribedAt: req.body.subscribedAt,
    status: req.body.status
  };

  try {
    const response = await mongodb.getDB().collection('subscribers').replaceOne({ _id: subscriberId }, subscriber);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the subscriber.');
    }
  } catch (err) {
    console.error('Error while updating the subscriber:', err);
    res.status(500).json({ error: 'Error while updating the subscriber.' });
  }
};

const deleteSubscriber = async (req, res) => {
  //  #swagger.tags=['Subscribers']
  const subscriberId = new ObjectId(req.params.id);
  try {
    const response = await mongodb.getDB().collection('subscribers').deleteOne({ _id: subscriberId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the subscriber.');
    }
  } catch (err) {
    console.error('Error while deleting the subscriber:', err);
    res.status(500).json({ error: 'Error while deleting the subscriber.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
};
