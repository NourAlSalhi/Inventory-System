'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('locations', [
      { name: 'Warehouse', type: 'warehouse', max_capacity: null, is_active: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Store Riyadh', type: 'store', max_capacity: 50, is_active: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Store Jeddah', type: 'store', max_capacity: 50, is_active: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('locations', null, {});
  },
};
