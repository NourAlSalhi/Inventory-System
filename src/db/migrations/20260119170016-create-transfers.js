'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transfers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      transfer_ref: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },

      from_location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'locations', key: 'id' },
        onDelete: 'CASCADE',
      },

      to_location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'locations', key: 'id' },
        onDelete: 'CASCADE',
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { min: 1 },
      },

      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },

      failure_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      requested_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addConstraint('transfers', {
      fields: ['from_location_id', 'to_location_id'],
      type: 'check',
      where: {
        from_location_id: { [Sequelize.Op.ne]: Sequelize.col('to_location_id') },
      },
      name: 'check_different_locations',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transfers');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_transfers_status";'
    );
  },
};
