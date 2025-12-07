const express = require('express');
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

// --------------------------
// Middleware
// --------------------------
app.use(bodyParser.json());
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// --------------------------
// Passport
// --------------------------
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => done(null, profile)
));

// --------------------------
// Auth routes
// --------------------------
app.get("/login", passport.authenticate("github"));
app.get("/github/callback", passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

app.get("/", (req, res) => {
  if (req.session.user) res.send(`Logged in as ${req.session.user.username}`);
  else res.send("Logged out");
});

// --------------------------
// API Routes + Swagger
// --------------------------
app.use('/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --------------------------
// Error Handlers
// --------------------------
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!", error: err.message });
});

// --------------------------
// Only start server if not testing
// --------------------------
if (require.main === module) {
  mongodb.initDB((err) => {
    if (err) console.error("❌ Error connecting to database:", err);
    else app.listen(process.env.PORT || 3000, () => console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`));
  });
}

// Export app for testing
module.exports = app;
