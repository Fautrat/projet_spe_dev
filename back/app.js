const express = require('express');
// const connectDB = require('./config/mysql');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use('/api/products', require('./routes/products-routes'));

app.listen(PORT, async () => {

    console.log(`Server is running on port ${PORT}`);

});