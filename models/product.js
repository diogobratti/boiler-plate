'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Product.belongsTo(models.Category);
      models.Product.belongsTo(models.Provider);
      models.Product.belongsTo(models.ProductGroup);
      models.Product.hasMany(models.Cart);
    }
  };
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    ingredients: DataTypes.TEXT,
    purchasePrice: DataTypes.FLOAT,
    salePrice: DataTypes.FLOAT,
    promotionalSalePrice: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    size: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Product',
    paranoid: true,
  });
  return Product;
};