const { User } = require('./users-model');
const { Product } = require('./products-model');
const { Basket } = require('./basket-model');
const { BasketItem } = require('./basket_items-model');

User.hasOne(Basket, { foreignKey: 'userId' });
Basket.belongsTo(User, { foreignKey: 'userId' });
Basket.belongsToMany(Product, {
  through: BasketItem,
  foreignKey: 'basketId',
  otherKey: 'productId'
});
Product.belongsToMany(Basket, {
  through: BasketItem,
  foreignKey: 'productId',
  otherKey: 'basketId'
});

BasketItem.belongsTo(Basket, { foreignKey: 'basketId' });
BasketItem.belongsTo(Product, { foreignKey: 'productId' });

Basket.hasMany(BasketItem, { foreignKey: 'basketId' });
Product.hasMany(BasketItem, { foreignKey: 'productId' });

console.log('Associations established between User and Basket');
console.log('Associations established between Basket and Product');

module.exports = { User, Product, Basket, BasketItem };
