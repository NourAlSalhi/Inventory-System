'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      { sku: 'MILK-01', name: 'Milk', createdAt: new Date(), updatedAt: new Date() },
      { sku: 'BREAD-01', name: 'Bread', createdAt: new Date(), updatedAt: new Date() },
      { sku: 'EGG-01', name: 'Eggs', createdAt: new Date(), updatedAt: new Date() },
      { sku: 'BUTTER-01', name: 'Butter', createdAt: new Date(), updatedAt: new Date() },
      { sku: 'CHEESE-01', name: 'Cheese', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
