const express = require('express');
const router = express.Router();
const Authenticate = require('../middlewares/auth-middleware');
const {getBasket, addProductToBasket, removeProductFromBasket, clearBasket} = require('../controllers/basket-controller');

router.get('/', getBasket);
router.post('/add', addProductToBasket);

router.delete('/remove/:productId', removeProductFromBasket);
router.delete('/clear', clearBasket);

module.exports = router;
