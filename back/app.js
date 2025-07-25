const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const productsRoutes = require('./routes/products-routes');
const authRoutes = require('./routes/auth-routes');

app.use(helmet());

// Can use CORS for just one route if needed

app.use(cors( {
    origin: 'http://localhost:' + (process.env.VITE_PORT || 5173),
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Protection csrf
const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'strict' } });
app.use(csrfProtection);
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

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});