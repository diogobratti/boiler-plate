'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Country.hasMany(models.State);
    }
  };
  Country.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    acronym: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Country',
    paranoid: true,
  });
  return Country;
};