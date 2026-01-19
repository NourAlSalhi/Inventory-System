"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("locations", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM("warehouse", "store"),
        allowNull: false,
      },

      max_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("locations", {
      fields: ["name", "type"],
      type: "unique",
      name: "unique_location_name_type",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("locations");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_locations_type";'
    );
  },
};
