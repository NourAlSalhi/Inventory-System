import { DataTypes, Model, Optional } from 'sequelize';

interface ProductAttributes {
  id: number;
  name: string;
  sku: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export const ProductModel = (sequelize: any) => {
  class Product extends Model<ProductAttributes, ProductCreationAttributes> 
    implements ProductAttributes {
    public id!: number;
    public name!: string;
    public sku!: string;
    
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'products',
      timestamps: true,
    }
  );

  return Product;
};