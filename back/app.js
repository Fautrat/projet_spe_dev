const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const productsRoutes = require('./routes/products-routes');
// const csrfMiddleware = require('./middlewares/csrf-middleware');
const sequelize = require('./config/mysql');

// Can use CORS for just one route if needed

app.use(cors( {
    origin: 'http://localhost:XXXX',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(csrfMiddleware);

app.use('/api/products', productsRoutes);

app.listen(PORT, async () => {

    console.log(`Server is running on port ${PORT}`);

});