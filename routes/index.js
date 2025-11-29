const express = require('express');
const router = express.Router();

// Swagger
router.use('/', require('./swagger'));

// Ruta raíz
router.get('/', (req, res) => {
  //  #swagger.tags=['Root']
  res.send('Welcome to the API');
});

// Rutas activas 🔥 (sin users, como pediste)
router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
router.use('/stores', require('./stores'));
router.use('/subscriber', require('./subscriber')); // en singular

module.exports = router;
