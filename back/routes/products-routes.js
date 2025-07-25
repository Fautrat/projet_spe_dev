const express = require('express');
const router = express.Router();
const {GetProducts,GetProductById,GetProductByLibelle,
        CreateProduct,DeleteProduct,EditProduct} = require('../controllers/products-controller');

const Authenticate = require('../middlewares/auth-middleware');
const upload = require('../middlewares/upload-middleware');


router.get('/', GetProducts);
router.get('/:id', GetProductById);
router.get('/libelle/:libelle', GetProductByLibelle);

router.post('/', Authenticate, upload.single('image'), CreateProduct);
router.put('/:id', Authenticate, upload.single('image'), EditProduct);
router.delete('/:id', Authenticate, DeleteProduct);

module.exports = router;