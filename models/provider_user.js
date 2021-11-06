'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Provider_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Provider_User.belongsTo(models.Provider);
      models.Provider_User.belongsTo(models.User);
    }
  };
  Provider_User.init({
    owner: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Provider_User',
    paranoid: true,
  });
  return Provider_User;
};