const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const csrfMiddleware = require('./middlewares/csrf-middleware');
const jwt = require('jsonwebtoken');
const Tokens = require('csrf');
const tokens = new Tokens();

const {GetProducts} = require('./controllers/products-controller');
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const productsRoutes = require('./routes/products-routes');
const authRoutes = require('./routes/auth-routes');
const basketRoutes = require('./routes/basket-routes');

const sequelize = require('./config/mysql');
sequelize.sync({ alter: true });

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors( {
    origin: 'http://localhost:' + (process.env.VITE_PORT || 5173),
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// permet de rendre le dossier assets accessible côté front
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/products', csrfMiddleware, productsRoutes);
app.use('/api/basket', csrfMiddleware, basketRoutes);
app.use('/api/auth',authRoutes);

app.get('/statistiques', (req, res) => {
    GetProducts(req, res);
});

app.get('/api/csrf-token', (req, res) => {
  const jwtToken = req.cookies['token'];
  if (!jwtToken) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const token = tokens.create(decoded.csrfSecret);

    return res.json({ csrfToken: token });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});