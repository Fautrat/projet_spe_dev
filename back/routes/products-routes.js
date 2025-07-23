const express = require('express');
const router = express.Router();
const {GetProducts,GetProductById,GetProductByLibelle,
        CreateProduct,DeleteProduct,EditProduct} = require('../controllers/products-controller');

router.get('/', GetProducts);
router.get('/:id', GetProductById);
router.get('/libelle/:libelle', GetProductByLibelle);

router.post('/', CreateProduct);
router.patch('/:id', EditProduct);
router.delete('/:id', DeleteProduct);

module.exports = router;