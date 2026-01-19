'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('inventory', [
      // Warehouse A
      { product_id: 1, location_id: 1, quantity: 100, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 2, location_id: 1, quantity: 80, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 3, location_id: 1, quantity: 200, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 4, location_id: 1, quantity: 50, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 5, location_id: 1, quantity: 30, createdAt: new Date(), updatedAt: new Date() },

      // Store X
      { product_id: 1, location_id: 2, quantity: 10, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 2, location_id: 2, quantity: 5, createdAt: new Date(), updatedAt: new Date() },

      // Store Y
      { product_id: 3, location_id: 3, quantity: 15, createdAt: new Date(), updatedAt: new Date() },
      { product_id: 4, location_id: 3, quantity: 5, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventory', null, {});
  },
};
