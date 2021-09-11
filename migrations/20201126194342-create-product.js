'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      ingredients: {
        type: Sequelize.TEXT
      },
      purchasePrice: {
        type: Sequelize.FLOAT
      },
      salePrice: {
        type: Sequelize.FLOAT
      },
      promotionalSalePrice: {
        type: Sequelize.FLOAT
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      providerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Providers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      productGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductGroups',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
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
    await queryInterface.bulkInsert('Products', [{
      name: 'Burrito',
      description: 'Carne de gado',
      ingredients: 'Tortilha, Carne de gado e salada',
      purchasePrice: 100.00,
      salePrice: 200.00,
      promotionalSalePrice: 150.00,
      quantity: null,
      size: 'Grande',
      categoryId: 1,
      providerId: 1,
      productGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Taco',
      description: 'Carne de frango',
      ingredients: 'Tortilha, Carne de gado e salada',
      purchasePrice: 110.00,
      salePrice: 210.00,
      promotionalSalePrice: 110.00,
      quantity: null,
      size: 'Médio',
      categoryId: 1,
      providerId: 1,
      productGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'X-salada',
      description: 'Completo',
      ingredients: 'Pão, hamburger, queijo, presunto, alface, tomate e cebola',
      purchasePrice: 100.00,
      salePrice: 200.00,
      promotionalSalePrice: 150.00,
      size: 'Aberto',
      quantity: null,
      categoryId: 1,
      providerId: 2,
      productGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Terno',
      description: 'Branco',
      purchasePrice: 100.00,
      salePrice: 200.00,
      promotionalSalePrice: 150.00,
      quantity: 5,
      size: 'G',
      categoryId: 2,
      providerId: 3,
      productGroupId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Vestido',
      description: 'Azul',
      purchasePrice: 100.00,
      salePrice: 200.00,
      promotionalSalePrice: 150.00,
      quantity: 20,
      size: 'P',
      categoryId: 2,
      providerId: 3,
      productGroupId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};