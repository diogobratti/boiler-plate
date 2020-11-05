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
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
      password: hashedPassword,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};