const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all books
const getAll = async (req, res) => {
  // #swagger.tags=['Books']
  try {
    const db = mongodb.getDB();
    const books = await db.collection('books').find().toArray();
    res.status(200).json(books);
  } catch (err) {
    console.error('Failed obtaining books:', err);
    res.status(500).json({ error: 'Failed obtaining books' });
  }
};

// GET single book by ID
const getSingle = async (req, res) => {
  // #swagger.tags=['Books']
  try {
    const bookId = req.params.id;
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const db = mongodb.getDB();
    const book = await db.collection('books').findOne({ _id: new ObjectId(bookId) });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error('Failed obtaining book:', err);
    res.status(500).json({ error: 'Failed obtaining book' });
  }
};

// CREATE a new book
const createBook = async (req, res) => {
  // #swagger.tags=['Books']
  try {
    const { title, authorId, genre, publishYear, pages, price } = req.body;

    // Validation
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    if (!authorId || !ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Valid authorId is required' });
    }
    if (genre && typeof genre !== 'string') {
      return res.status(400).json({ error: 'Genre must be a string' });
    }
    if (publishYear && typeof publishYear !== 'number') {
      return res.status(400).json({ error: 'publishYear must be a number' });
    }
    if (pages && typeof pages !== 'number') {
      return res.status(400).json({ error: 'Pages must be a number' });
    }
    if (price && typeof price !== 'number') {
      return res.status(400).json({ error: 'Price must be a number' });
    }

    const book = { title, authorId: new ObjectId(authorId), genre, publishYear, pages, price };

    const db = mongodb.getDB();
    const response = await db.collection('books').insertOne(book);

    if (!response.acknowledged) {
      return res.status(500).json({ error: 'Could not create the book' });
    }

    res.status(201).json({ message: 'Book created successfully', id: response.insertedId });
  } catch (err) {
    console.error('Error while creating the book:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE a book
const updateBook = async (req, res) => {
  // #swagger.tags=['Books']
  try {
    const bookId = req.params.id;
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const { title, authorId, genre, publishYear, pages, price } = req.body;

    // Validation
    if (title && typeof title !== 'string') {
      return res.status(400).json({ error: 'Title must be a string' });
    }
    if (authorId && !ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid authorId' });
    }
    if (genre && typeof genre !== 'string') {
      return res.status(400).json({ error: 'Genre must be a string' });
    }
    if (publishYear && typeof publishYear !== 'number') {
      return res.status(400).json({ error: 'publishYear must be a number' });
    }
    if (pages && typeof pages !== 'number') {
      return res.status(400).json({ error: 'Pages must be a number' });
    }
    if (price && typeof price !== 'number') {
      return res.status(400).json({ error: 'Price must be a number' });
    }

    const bookUpdate = {};
    if (title) bookUpdate.title = title;
    if (authorId) bookUpdate.authorId = new ObjectId(authorId);
    if (genre) bookUpdate.genre = genre;
    if (publishYear) bookUpdate.publishYear = publishYear;
    if (pages) bookUpdate.pages = pages;
    if (price) bookUpdate.price = price;

    const db = mongodb.getDB();
    const response = await db.collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: bookUpdate }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error while updating the book:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a book
const deleteBook = async (req, res) => {
  // #swagger.tags=['Books']
  try {
    const bookId = req.params.id;
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    const db = mongodb.getDB();
    const response = await db.collection('books').deleteOne({ _id: new ObjectId(bookId) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error while deleting the book:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook
};
