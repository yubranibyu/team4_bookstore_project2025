const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const { validateBook, validateObjectId } = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');


//  #swagger.tags=['Books']
router.get('/', booksController.getAll);
//  #swagger.tags=['Books']
router.get('/:id', validateObjectId('id'), booksController.getSingle);
//  #swagger.tags=['Books']
router.post('/',isAuthenticated, validateBook, booksController.createBook);
//  #swagger.tags=['Books']
router.put('/:id',isAuthenticated, validateObjectId('id'), validateBook, booksController.updateBook);
//  #swagger.tags=['Books']
router.delete('/:id', isAuthenticated, validateObjectId('id'),  booksController.deleteBook);

module.exports = router;
