const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //  #swagger.tags=['Authors']
  try {
    const db = mongodb.getDB();
    const authors = await db.collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (err) {
    console.error('Failed obtaining authors:', err);
    res.status(500).json({ error: 'Failed obtaining authors' });
  }
};

const getSingle = async (req, res) => {
  //  #swagger.tags=['Authors']
  try {
    const authorId = new ObjectId(req.params.id);
    const db = mongodb.getDB();
    const author = await db.collection('authors').findOne({ _id: authorId });

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (err) {
    console.error('Failed obtaining author:', err);
    res.status(500).json({ error: 'Failed obtaining author' });
  }
};

const createAuthor = async (req, res) => {
  //  #swagger.tags=['Authors']
  
  const author = {
    name: req.body.name,
    birthYear: req.body.birthYear,
    nationality: req.body.nationality,
    awards: req.body.awards || [],
    numBooksWritten: req.body.numBooksWritten
  };

  try {
    const response = await mongodb.getDB().collection('authors').insertOne(author);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Author created successfully', id: response.insertedId });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the author.');
    }
  } catch (err) {
    res.status(500).json({ error: 'Error while creating the author.' });
  }
};

const updateAuthor = async (req, res) => {
  //  #swagger.tags=['Authors']
  const authorId = new ObjectId(req.params.id);
  const author = {
    name: req.body.name,
    birthYear: req.body.birthYear,
    nationality: req.body.nationality,
    awards: req.body.awards || [],
    numBooksWritten: req.body.numBooksWritten
  };

  try {
    const response = await mongodb.getDB().collection('authors').replaceOne({ _id: authorId }, author);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the author.');
    }
  } catch (err) {
    res.status(500).json({ error: 'Error while updating the author.' });
  }
};

const deleteAuthor = async (req, res) => {
  //  #swagger.tags=['Authors']
  const authorId = new ObjectId(req.params.id);
  try {
    const response = await mongodb.getDB().collection('authors').deleteOne({ _id: authorId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the author.');
    }
  } catch (err) {
    res.status(500).json({ error: 'Error while deleting the author.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
