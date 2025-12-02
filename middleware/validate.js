const { 
  authorValidation, 
  bookValidation, 
  storeValidation, 
  subscriberValidation 
} = require('../helpers/validate');

const { ObjectId } = require('mongodb');

// --------------------------
// Helper: Validate MongoDB ObjectId
// --------------------------
const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};

const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: `${paramName} is required`
      });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }

    next();
  };
};

// --------------------------
// Generic Validation Middleware Wrapper
// --------------------------
const runValidation = (validatorFn) => {
  return (req, res, next) => {
    validatorFn(req.body, (errors, isValid) => {
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors
        });
      }
      next();
    });
  };
};

// --------------------------
// Specific Validation Middlewares
// --------------------------
const validateAuthor = runValidation(authorValidation);
const validateBook = runValidation(bookValidation);
const validateStore = runValidation(storeValidation);
const validateSubscriber = runValidation(subscriberValidation);

// --------------------------
// Exports
// --------------------------
module.exports = {
  validateAuthor,
  validateBook,
  validateStore,
  validateSubscriber,
  validateObjectId
};
