const express = require('express');
const router = express.Router();
const Authenticate = require('../middlewares/auth-middleware');
const {getBasket, addProductToBasket, removeProductFromBasket, clearBasket} = require('../controllers/basket-controller');

router.get('/', Authenticate, getBasket);
router.post('/', Authenticate, addProductToBasket);

router.delete('/:productId', Authenticate, removeProductFromBasket);
router.delete('/clear', Authenticate, clearBasket);

module.exports = router;
