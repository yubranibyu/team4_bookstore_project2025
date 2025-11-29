const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  //  #swagger.tags=['Books']
  try {
    const db = mongodb.getDB();
    const books = await db.collection('books').find().toArray();

    res.status(200).json(books);
  } catch (err) {
    console.error('Failed obtaining books:', err);
    res.status(500).json({ error: 'Failed obtaining books' });
  }
};

const getSingle = async (req, res) => {
  //  #swagger.tags=['Books']
  try {
    const bookId = new ObjectId(req.params.id);
    const db = mongodb.getDB();
    const book = await db.collection('books').findOne({ _id: bookId });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error('Failed obtaining book:', err);
    res.status(500).json({ error: 'Failed obtaining book' });
  }
};

const createBook = async (req, res) => {
  //  #swagger.tags=['Books']
  const book = {
    title: req.body.title,
    author: req.body.author, // Puede ser string o ObjectId si lo deseas
    genre: req.body.genre,
    publishedYear: req.body.publishedYear,
    language: req.body.language,
    pages: req.body.pages,
    available: req.body.available,
    summary: req.body.summary
  };

  try {
    const response = await mongodb.getDB().collection('books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Book created successfully', id: response.insertedId });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the book.');
    }
  } catch (err) {
    console.error('Error while creating the book:', err);
    res.status(500).json({ error: 'Error while creating the book.' });
  }
};

const updateBook = async (req, res) => {
  //  #swagger.tags=['Books']
  const bookId = new ObjectId(req.params.id);
  const book = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    publishedYear: req.body.publishedYear,
    language: req.body.language,
    pages: req.body.pages,
    available: req.body.available,
    summary: req.body.summary
  };

  try {
    const response = await mongodb.getDB().collection('books').replaceOne({ _id: bookId }, book);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the book.');
    }
  } catch (err) {
    console.error('Error while updating the book:', err);
    res.status(500).json({ error: 'Error while updating the book.' });
  }
};

const deleteBook = async (req, res) => {
  //  #swagger.tags=['Books']
  const bookId = new ObjectId(req.params.id);
  try {
    const response = await mongodb.getDB().collection('books').deleteOne({ _id: bookId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the book.');
    }
  } catch (err) {
    console.error('Error while deleting the book:', err);
    res.status(500).json({ error: 'Error while deleting the book.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook
};
