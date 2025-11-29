const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');

//  #swagger.tags=['Books']
router.get('/', booksController.getAll);
//  #swagger.tags=['Books']
router.get('/:id', booksController.getSingle);
//  #swagger.tags=['Books']
router.post('/', booksController.createBook);
//  #swagger.tags=['Books']
router.put('/:id', booksController.updateBook);
//  #swagger.tags=['Books']
router.delete('/:id', booksController.deleteBook);

module.exports = router;
