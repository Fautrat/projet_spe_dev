const express = require('express');
const router = express.Router();
const {GetProducts,GetProductById,GetProductByLibelle,
        CreateProduct,DeleteProduct,EditProduct} = require('../controllers/products-controller');

const Authenticate = require('../middlewares/auth-middleware');
const CSRF = require('../middlewares/csrf-middleware');


router.get('/', GetProducts);
router.get('/:id', GetProductById);
router.get('/libelle/:libelle', GetProductByLibelle);

router.post('/', Authenticate, CSRF, CreateProduct);
router.patch('/:id', Authenticate, CSRF, EditProduct);
router.delete('/:id', Authenticate, CSRF, DeleteProduct);

module.exports = router;