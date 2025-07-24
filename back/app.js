const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const sequelize = require('./config/mysql');
const productsRoutes = require('./routes/products-routes');
const authRoutes = require('./routes/auth-routes');
const Tokens = require('csrf');
const tokens = new Tokens();
// const csrfMiddleware = require('./middlewares/csrf-middleware');

// Can use CORS for just one route if needed

app.use(cors( {
    origin: 'http://localhost:' + (process.env.VITE_PORT || 5100),
    credentials: true
}));

// app.use(csrfMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/api/csrf-token', (req, res) => {
  const secret = tokens.secretSync();
  const token = tokens.create(secret);

  res.cookie('csrf-secret', secret, {
    httpOnly: true,
    sameSite: 'Strict',
  });

  res.json({ csrfToken: token });
});

app.use('/api/products', productsRoutes);
app.use('/api/auth',authRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});