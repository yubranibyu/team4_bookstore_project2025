const express = require('express');
const app = express();

const mongodb = require('./data/database');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
require('dotenv').config(); // Activa variables de entorno

// Middleware para leer JSON
app.use(bodyParser.json());
// O también puedes usar: app.use(express.json());

// Rutas
app.use('/', require('./routes'));

// Conexión a la DB y arranque del servidor
mongodb.initDB((err) => {  // ← Asegúrate que es initDb (minúscula)
  if (err) {
    console.log('❌ Error connecting to database:', err);
  } else {
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  }
});
