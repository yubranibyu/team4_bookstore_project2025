const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all authors
const getAll = async (req, res) => {
  // #swagger.tags=['Authors']
  try {
    const db = mongodb.getDB();
    const authors = await db.collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (err) {
    console.error('Failed obtaining authors:', err);
    res.status(500).json({ error: 'Failed obtaining authors' });
  }
};

// GET single author by ID
const getSingle = async (req, res) => {
  // #swagger.tags=['Authors']
  try {
    const authorId = req.params.id;
    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const db = mongodb.getDB();
    const author = await db.collection('authors').findOne({ _id: new ObjectId(authorId) });

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (err) {
    console.error('Failed obtaining author:', err);
    res.status(500).json({ error: 'Failed obtaining author' });
  }
};

// CREATE a new author
const createAuthor = async (req, res) => {
  // #swagger.tags=['Authors']
  try {
    const { name, birthYear, nationality, awards, numBooksWritten } = req.body;

    // Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required and must be a string' });
    }
    if (birthYear && typeof birthYear !== 'number') {
      return res.status(400).json({ error: 'birthYear must be a number' });
    }
    if (nationality && typeof nationality !== 'string') {
      return res.status(400).json({ error: 'nationality must be a string' });
    }
    if (awards && !Array.isArray(awards)) {
      return res.status(400).json({ error: 'awards must be an array of strings' });
    }
    if (numBooksWritten && typeof numBooksWritten !== 'number') {
      return res.status(400).json({ error: 'numBooksWritten must be a number' });
    }

    const author = { name, birthYear, nationality, awards, numBooksWritten };
    const db = mongodb.getDB();
    const response = await db.collection('authors').insertOne(author);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Could not create the author' });
    }

    res.status(201).json({ message: 'Author created successfully', id: response.insertedId });
  } catch (err) {
    console.error('Error while creating the author:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE an author
const updateAuthor = async (req, res) => {
  // #swagger.tags=['Authors']
  try {
    const authorId = req.params.id;
    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const { name, birthYear, nationality, awards, numBooksWritten } = req.body;

    const authorUpdate = {};
    if (name) authorUpdate.name = name;
    if (birthYear) authorUpdate.birthYear = birthYear;
    if (nationality) authorUpdate.nationality = nationality;
    if (awards) authorUpdate.awards = awards;
    if (numBooksWritten) authorUpdate.numBooksWritten = numBooksWritten;

    const db = mongodb.getDB();
    const response = await db.collection('authors').updateOne(
      { _id: new ObjectId(authorId) },
      { $set: authorUpdate }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error while updating the author:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE an author
const deleteAuthor = async (req, res) => {
  // #swagger.tags=['Authors']
  try {
    const authorId = req.params.id;
    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const db = mongodb.getDB();
    const response = await db.collection('authors').deleteOne({ _id: new ObjectId(authorId) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error while deleting the author:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
