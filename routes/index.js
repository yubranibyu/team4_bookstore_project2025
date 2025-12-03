const express = require('express');
const router = express.Router();
const passport = require("passport");

// Swagger route (correct)
router.use('/', require('./swagger'));

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Root route
router.get('/', (req, res) => {
    //  #swagger.tags=['Root']
    res.send('Welcome to the API');
});

// Active routes
router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
router.use('/stores', require('./stores'));
router.use('/subscriber', require('./subscriber')); // singular

module.exports = router;
