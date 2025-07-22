const express = require('express');
// const connectDB = require('./config/mysql');
const app = express();
const PORT = process.env.PORT || 3000;
const productsRoutes = require('./routes/products-routes');
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/products', productsRoutes);

app.listen(PORT, async () => {

    console.log(`Server is running on port ${PORT}`);

});