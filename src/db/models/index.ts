import Product from './product.model';
import Location from './location.model';
import Inventory from './inventory.model';
import Transfer from './transfer.model';

// Inventory Associations
Product.hasMany(Inventory, { foreignKey: 'product_id' });
Inventory.belongsTo(Product, { foreignKey: 'product_id' });

Location.hasMany(Inventory, { foreignKey: 'location_id' });
Inventory.belongsTo(Location, { foreignKey: 'location_id' });

// Transfer Associations
Product.hasMany(Transfer, { foreignKey: 'product_id' });
Transfer.belongsTo(Product, { foreignKey: 'product_id' });

Location.hasMany(Transfer, { foreignKey: 'from_location_id', as: 'fromTransfers' });
Location.hasMany(Transfer, { foreignKey: 'to_location_id', as: 'toTransfers' });
Transfer.belongsTo(Location, { foreignKey: 'from_location_id', as: 'fromLocation' });
Transfer.belongsTo(Location, { foreignKey: 'to_location_id', as: 'toLocation' });

export { Product, Location, Inventory, Transfer };
