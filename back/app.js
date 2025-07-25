const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const productsRoutes = require('./routes/products-routes');
const authRoutes = require('./routes/auth-routes');
const basketRoutes = require('./routes/basket-routes');

const sequelize = require('./config/mysql');
const { User, Product, Basket, BasketItem } = require('./models/associations');
sequelize.sync({ alter: true });

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Can use CORS for just one route if needed
app.use(cors( {
    origin: 'http://localhost:' + (process.env.VITE_PORT || 5173),
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// permet de rendre le dossier assets accessible côté front
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Protection csrf
const csrfProtection = csurf({ cookie: { httpOnly: true, sameSite: 'strict' } });
app.use(csrfProtection);

app.use('/api/products', productsRoutes);
app.use('/api/basket', basketRoutes);
app.use('/api/auth',authRoutes);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});