'use strict';
const bcrypt = require('bcrypt');
const generalConfig = require('../config')["general"];
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      emailVerified:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false,
      },
      phoneVerified:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      allowExtraEmails: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      allowExtraWhatsapp: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      termsAccepted: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id'
        },
        // onUpdate: 'cascade',
        // onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
    const hashedPassword = await bcrypt.hash('123456789', generalConfig.bcryptRounds)
    await queryInterface.bulkInsert('Users', [{
      name: 'Diogo Bratti',
      email: 'dbratti@gmail.com',
      username: 'dbratti',
      phone: '(48) 99951-8667',
      password: hashedPassword,
      roleId: 1,
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      termsAccepted: new Date(),
      allowExtraEmails: true
    },{
      name: 'Vendedor Teste',
      email: 'lojasbemutil@gmail.com',
      username: 'vendedor',
      phone: '(48) 99951-8667',
      password: hashedPassword,
      roleId: 2,
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      termsAccepted: new Date(),
      allowExtraEmails: true
    },{
      name: 'Cliente Teste',
      email: 'dbratti.vendas@gmail.com',
      username: 'cliente',
      phone: '(48) 99951-8667',
      password: hashedPassword,
      roleId: 3,
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      termsAccepted: new Date(),
      allowExtraEmails: true
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};