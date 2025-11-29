const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all subscribers
const getAll = async (req, res) => {
  // #swagger.tags=['Subscriber']
  try {
    const db = mongodb.getDB();
    const subscribers = await db.collection('subscriber').find().toArray();
    res.status(200).json(subscribers);
  } catch (err) {
    console.error('Failed obtaining subscribers:', err);
    res.status(500).json({ error: 'Failed obtaining subscribers' });
  }
};

// GET single subscriber
const getSingle = async (req, res) => {
  // #swagger.tags=['Subscriber']
  try {
    const subscriberId = req.params.id;
    if (!ObjectId.isValid(subscriberId)) return res.status(400).json({ error: 'Invalid subscriber ID' });

    const db = mongodb.getDB();
    const subscriber = await db.collection('subscriber').findOne({ _id: new ObjectId(subscriberId) });

    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });

    res.status(200).json(subscriber);
  } catch (err) {
    console.error('Failed obtaining subscriber:', err);
    res.status(500).json({ error: 'Failed obtaining subscriber' });
  }
};

// CREATE a new subscriber
const createSubscriber = async (req, res) => {
  // #swagger.tags=['Subscriber']
  try {
    const { subscribername, email, accessToken, role } = req.body;

    if (!subscribername || typeof subscribername !== 'string') {
      return res.status(400).json({ error: 'subscribername is required and must be a string' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email is required and must be a string' });
    }
    if (!accessToken || typeof accessToken !== 'string') {
      return res.status(400).json({ error: 'accessToken is required and must be a string' });
    }
    if (!role || typeof role !== 'string') {
      return res.status(400).json({ error: 'role is required and must be a string' });
    }

    const subscriber = { subscribername, email, accessToken, role };
    const db = mongodb.getDB();
    const response = await db.collection('subscriber').insertOne(subscriber);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Could not create subscriber' });
    }

    res.status(201).json({ message: 'Subscriber created successfully', id: response.insertedId });
  } catch (err) {
    console.error('Error while creating subscriber:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE a subscriber
const updateSubscriber = async (req, res) => {
  // #swagger.tags=['Subscriber']
  try {
    const subscriberId = req.params.id;
    if (!ObjectId.isValid(subscriberId)) return res.status(400).json({ error: 'Invalid subscriber ID' });

    const { subscribername, email, accessToken, role } = req.body;
    const subscriberUpdate = {};
    if (subscribername) subscriberUpdate.subscribername = subscribername;
    if (email) subscriberUpdate.email = email;
    if (accessToken) subscriberUpdate.accessToken = accessToken;
    if (role) subscriberUpdate.role = role;

    const db = mongodb.getDB();
    const response = await db.collection('subscriber').updateOne(
      { _id: new ObjectId(subscriberId) },
      { $set: subscriberUpdate }
    );

    if (response.matchedCount === 0) return res.status(404).json({ error: 'Subscriber not found' });

    res.status(204).send();
  } catch (err) {
    console.error('Error while updating subscriber:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a subscriber
const deleteSubscriber = async (req, res) => {
  // #swagger.tags=['Subscriber']
  try {
    const subscriberId = req.params.id;
    if (!ObjectId.isValid(subscriberId)) return res.status(400).json({ error: 'Invalid subscriber ID' });

    const db = mongodb.getDB();
    const response = await db.collection('subscriber').deleteOne({ _id: new ObjectId(subscriberId) });

    if (response.deletedCount === 0) return res.status(404).json({ error: 'Subscriber not found' });

    res.status(204).send();
  } catch (err) {
    console.error('Error while deleting subscriber:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
};
