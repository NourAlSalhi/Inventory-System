import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface LocationAttributes {
  id: number;
  name: string;
  type: 'warehouse' | 'store';
  max_capacity?: number | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LocationCreationAttributes extends Optional<LocationAttributes, 'id'> {}

class Location extends Model<LocationAttributes, LocationCreationAttributes>
  implements LocationAttributes {
  public id!: number;
  public name!: string;
  public type!: 'warehouse' | 'store';
  public max_capacity!: number | null;
  public is_active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: { type: DataTypes.ENUM('warehouse', 'store'), allowNull: false },
    max_capacity: { type: DataTypes.INTEGER, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'locations',
    timestamps: true,
  }
);

export default Location;
