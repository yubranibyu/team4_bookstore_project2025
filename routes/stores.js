const express = require('express');
const router = express.Router();

const storesController = require('../controllers/stores');

//  #swagger.tags=['Stores']
router.get('/', storesController.getAll);
//  #swagger.tags=['Stores']
router.get('/:id', storesController.getSingle);
//  #swagger.tags=['Stores']
router.post('/', storesController.createStore);
//  #swagger.tags=['Stores']
router.put('/:id', storesController.updateStore);
//  #swagger.tags=['Stores']
router.delete('/:id', storesController.deleteStore);

module.exports = router;
