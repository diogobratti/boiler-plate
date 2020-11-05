'use strict';
const {
  Model
} = require('sequelize');
const { InvalidArgumentError } = require('../error/error');
const validation = require('../validation/validation-commom');
const bcrypt = require('bcrypt');
const generalConfig = require('../config')["general"];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsTo(models.Role);
      models.User.hasMany(models.Address);
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: true,
      is: /^[0-9a-f]{64}$/i
    },
    allowExtraEmails: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowExtraWhatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    termsAccepted: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.NOW,
    },
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
  });
  function hashPasswordHook (instance, options) {
    if (!instance.changed('password')) return ;
    const password = instance.getDataValue('password');
    validation.notNullStringField(password, 'password');
    validation.minimumSizeField(password, 'password', 8);
    validation.maximumSizeField(password, 'password', 64);
    return bcrypt
      .hash(password, generalConfig.bcryptRounds)
      .then(hash => (instance.setDataValue('password', hash)));
  }
  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);
  return User;
};