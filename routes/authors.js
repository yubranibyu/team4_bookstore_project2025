const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors');

const { validateAuthor, validateObjectId } = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');

router.get('/', authorsController.getAll);
router.get('/:id',  validateObjectId('id'),authorsController.getSingle);
router.post('/',  isAuthenticated, validateAuthor,authorsController.createAuthor);
router.put('/:id', isAuthenticated, validateObjectId('id'), validateAuthor,authorsController.updateAuthor);
router.delete('/:id',isAuthenticated, validateObjectId('id'), authorsController.deleteAuthor);

module.exports = router;
