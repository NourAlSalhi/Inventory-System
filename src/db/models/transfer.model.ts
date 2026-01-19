import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import Product from './product.model';
import Location from './location.model';

interface TransferAttributes {
  id: number;
  transfer_ref: string;
  product_id: number;
  from_location_id: number;
  to_location_id: number;
  quantity: number;
  status: 'pending' | 'completed' | 'failed';
  failure_reason?: string | null;
  requested_at?: Date;
  completed_at?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransferCreationAttributes extends Optional<TransferAttributes, 'id' | 'status' | 'requested_at' | 'completed_at' | 'failure_reason'> {}

class Transfer extends Model<TransferAttributes, TransferCreationAttributes>
  implements TransferAttributes {
  public id!: number;
  public transfer_ref!: string;
  public product_id!: number;
  public from_location_id!: number;
  public to_location_id!: number;
  public quantity!: number;
  public status!: 'pending' | 'completed' | 'failed';
  public failure_reason!: string | null;
  public requested_at!: Date;
  public completed_at!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transfer.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transfer_ref: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    from_location_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Location, key: 'id' } },
    to_location_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Location, key: 'id' } },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), allowNull: false, defaultValue: 'pending' },
    failure_reason: { type: DataTypes.TEXT, allowNull: true },
    requested_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    completed_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'transfers',
    timestamps: true,
  }
);

export default Transfer;
