const express = require('express');
const mongodb = require('./data/database'); 
const port = process.env.PORT || 3000;
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

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
//   cookie: { secure: false } // secure=true only on HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// --------------------------
// Passport serialization
// --------------------------
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// --------------------------
// GitHub OAuth Strategy
// --------------------------
passport.use(new GithubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL, // e.g. http://localhost:3000/github/callback

  },
 function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

// --------------------------
// Auth Routes
// --------------------------
app.get("/login", passport.authenticate("github"));

app.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/api-docs" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

// cjeck login status

app.get("/", (req, res) => {
  if (req.session.user) {
    res.send(`Logged in as ${req.session.user.username}`);
  } else {
    res.send("Logged out");
  }
});

// --------------------------
// Main Api Routes
// --------------------------
app.use('/', routes); // load custom API routes FIRST

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* --------------------------
   ERROR HANDLERS
--------------------------- */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// --------------------------
// Database + Server Startup
// --------------------------
mongodb.initDB((err) => { // ✅ correct case
  if (err) {
    console.error("❌ Error connecting to database:", err);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  }
});