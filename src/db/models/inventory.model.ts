import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Product from './product.model';
import Location from './location.model';

interface InventoryAttributes {
  id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id'> {}

class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes {
  public id!: number;
  public product_id!: number;
  public location_id!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Inventory.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Product, key: 'id' },
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Location, key: 'id' },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'inventory',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'location_id'],
      },
    ],
  }
);

Inventory.belongsTo(Product, { foreignKey: 'product_id', as: 'Product' });
Inventory.belongsTo(Location, { foreignKey: 'location_id', as: 'Location' });


export default Inventory;
