const { Basket, BasketItem, Product } = require('../models/associations');

module.exports.getBasket = async (req, res) => {
    try {
      const basket = await Basket.findOne({
        where: { userId: req.user.id },
        include: {
          model: BasketItem,
          include: Product
        }
      });

      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }

      res.json(basket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

module.exports.addProductToBasket = async (req, res) => {
    const { productId } = req.body;
    try {
      let basket = await Basket.findOne({ where: { userId: req.user.id } });

      let basketItem = await BasketItem.findOne({
        where: { basketId: basket.id, productId }
      });

      if (basketItem) {
        basketItem.quantity += 1;
        await basketItem.save();
      }
      else {
        basketItem = await BasketItem.create({
          basketId: basket.id,
          productId,
          quantity: 1
        });
      }

      res.status(200).json({ message: 'Product added to the basket', basketItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }


module.exports.removeProductFromBasket = async (req, res) => {
    const { productId } = req.params;

    try {
      const basket = await Basket.findOne({ where: { userId: req.user.id } });
      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }

      const basketItem = await BasketItem.findOne({
        where: { basketId: basket.id, productId }
      });

      if (!basketItem) {
        return res.status(404).json({ message: 'Product not found in basket' });
      }

      await basketItem.destroy();

      res.status(200).json({ message: 'Product removed from basket' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

module.exports.clearBasket = async (req, res) => {

    try {
      const basket = await Basket.findOne({ where: { userId: req.user.id } });
      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }

      await BasketItem.destroy({ where: { basketId: basket.id } });

      res.status(200).json({ message: 'Basket cleared' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

