const express = require('express');
const router = express.Router();
const {getProducts,getProductById,getProductByLibelle,
        createProduct,deleteProduct,editProduct} = require('../controllers/products-controller');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/libelle/:libelle', getProductByLibelle);

router.post('/', createProduct);
router.patch('/:id', editProduct);
router.delete('/:id', deleteProduct);

module.exports = router;