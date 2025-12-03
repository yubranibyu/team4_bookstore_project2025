const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores');

const { validateStore, validateObjectId } = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');

//  #swagger.tags=['Stores']
router.get('/', storesController.getAll);
//  #swagger.tags=['Stores']
router.get('/:id',validateObjectId('id'), storesController.getSingle);
//  #swagger.tags=['Stores']
router.post('/', isAuthenticated, validateStore, storesController.createStore);
//  #swagger.tags=['Stores']
router.put('/:id',isAuthenticated, validateObjectId('id'), validateStore, storesController.updateStore);
//  #swagger.tags=['Stores']
router.delete('/:id',isAuthenticated, validateObjectId('id'), storesController.deleteStore);

module.exports = router;
