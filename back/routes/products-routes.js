const express = require('express');
const router = express.Router();
const {getProducts,getProductById,getProductByName,createProduct,deleteProduct,editProduct} = require('../controllers/products-controller');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/name/:name', getProductByName);

router.post('/', createProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id', editProduct);

module.exports = router;