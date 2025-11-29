const express = require('express');
const router = express.Router();

const subscriberController = require('../controllers/subscriber');

//  #swagger.tags=['Subscriber']
router.get('/', subscriberController.getAll);
//  #swagger.tags=['Subscriber']
router.get('/:id', subscriberController.getSingle);
//  #swagger.tags=['Subscriber']
router.post('/', subscriberController.createSubscriber);
//  #swagger.tags=['Subscriber']
router.put('/:id', subscriberController.updateSubscriber);
//  #swagger.tags=['Subscriber']
router.delete('/:id', subscriberController.deleteSubscriber);

module.exports = router;
