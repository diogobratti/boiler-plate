"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Providers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      agent: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      isStarred: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Cities",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.bulkInsert("Providers", [
      {
        name: "Lanchonete da Esquina do Vendedor",
        agent: "Machado de Assis",
        phone: "48 98765-4321",
        email: "email@email.com",
        isStarred: true,
        categoryId: 1,
        cityId: 4506,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lanchonete da Outra Esquina do Admin",
        agent: "Monteiro Lobato",
        phone: "48 98765-4321",
        email: "email@email.com",
        categoryId: 1,
        isStarred: false,
        cityId: 4506,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Loja da Avenida do Admin",
        agent: "Saci Perere",
        phone: "48 98765-4321",
        email: "email@email.com",
        isStarred: false,
        categoryId: 2,
        cityId: 4506,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Providers");
  },
};
