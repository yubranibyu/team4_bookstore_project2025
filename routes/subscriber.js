const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriber');
const { validateSubscriber, validateObjectId } = require('../middleware/validate');
const isAuthenticated = require('../middleware/authenticate');


//  #swagger.tags=['Subscriber']
router.get('/', subscriberController.getAll);
//  #swagger.tags=['Subscriber']
router.get('/:id', validateObjectId('id'), subscriberController.getSingle);
//  #swagger.tags=['Subscriber']
router.post('/', isAuthenticated, validateSubscriber, subscriberController.createSubscriber);
//  #swagger.tags=['Subscriber']
router.put('/:id', isAuthenticated, validateObjectId('id'), validateSubscriber, subscriberController.updateSubscriber);
//  #swagger.tags=['Subscriber']
router.delete('/:id',isAuthenticated, validateObjectId('id'), subscriberController.deleteSubscriber);

module.exports = router;
