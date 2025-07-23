const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const sequelize = require('./config/mysql');
const productsRoutes = require('./routes/products-routes');
const authRoutes = require('./routes/auth-routes');
// const csrfMiddleware = require('./middlewares/csrf-middleware');

// Can use CORS for just one route if needed

app.use(cors( {
    origin: 'http://localhost:5173',
    credentials: true
}));

// app.use(csrfMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/products', productsRoutes);
app.use('/api/auth',authRoutes);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});