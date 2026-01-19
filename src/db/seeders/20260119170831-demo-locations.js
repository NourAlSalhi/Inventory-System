'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('locations', [
      { name: 'Warehouse A', type: 'warehouse', max_capacity: null, is_active: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Store X', type: 'store', max_capacity: 50, is_active: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Store Y', type: 'store', max_capacity: 50, is_active: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('locations', null, {});
  },
};
