const Validator = require('validatorjs');
const { ObjectId } = require('mongodb');

// Generic validator wrapper
const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

// --------------------------
// Author Validation
// --------------------------
const authorValidation = (data, callback) => {
  const rules = {
    name: "required|string",
    birthYear: "numeric",
    nationality: "string",
    awards: "array",
    numBooksWritten: "numeric"
  };

  const customMessages = {
    "name.required": "Author name is required",
    "name.string": "Author name must be a string",
    "birthYear.numeric": "Birth year must be a number",
    "nationality.string": "Nationality must be a string",
    "awards.array": "Awards must be an array",
    "numBooksWritten.numeric": "Number of books written must be a number"
  };

  validator(data, rules, customMessages, callback);
};

// --------------------------
// Book Validation
// --------------------------
const bookValidation = (data, callback) => {
  const rules = {
    title: "required|string",
    authorId: "required|string",
    genre: "string",
    publishYear: "numeric",
    pages: "numeric",
    price: "numeric|min:0"
  };

  const customMessages = {
    "title.required": "Book title is required",
    "title.string": "Book title must be a string",
    "authorId.required": "Author ID is required",
    "authorId.string": "Author ID must be a string",
    "genre.string": "Genre must be a string",
    "publishYear.numeric": "Publish year must be a number",
    "pages.numeric": "Pages must be a number",
    "price.numeric": "Price must be a number",
    "price.min": "Price cannot be negative"
  };

  validator(data, rules, customMessages, callback);
};

// --------------------------
// Store Validation
// --------------------------
const storeValidation = (data, callback) => {
  const rules = {
    location: "required|string",
    owner: "required|string"
  };

  const customMessages = {
    "location.required": "Store location is required",
    "location.string": "Location must be a string",
    "owner.required": "Store owner is required",
    "owner.string": "Owner must be a string"
  };

  validator(data, rules, customMessages, callback);
};

// --------------------------
// Subscriber Validation
// --------------------------
const subscriberValidation = (data, callback) => {
  const rules = {
    subscribername: "required|string",
    email: "required|email",
    accessToken: "required|string",
    role: "required|string"
  };

  const customMessages = {
    "subscribername.required": "Subscriber name is required",
    "subscribername.string": "Subscriber name must be a string",
    "email.required": "Email is required",
    "email.email": "Email must be valid",
    "accessToken.required": "Access token is required",
    "accessToken.string": "Access token must be a string",
    "role.required": "Role is required",
    "role.string": "Role must be a string"
  };

  validator(data, rules, customMessages, callback);
};

// --------------------------
// Exports
// --------------------------
module.exports = {
  validator,
  authorValidation,
  bookValidation,
  storeValidation,
  subscriberValidation
};
