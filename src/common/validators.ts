export const isValidId = (value: any) =>
    typeof value === "number" && !isNaN(value) && value > 0;
  
  export const validateTransferPayload = (payload: any) => {
    const { product_id, from_location_id, to_location_id, quantity } = payload;
  
    if (!product_id || !from_location_id || !to_location_id || !quantity) {
      return "Missing required fields";
    }
  
    if (from_location_id === to_location_id) {
      return "Cannot transfer to the same location";
    }
  
    if (quantity <= 0) {
      return "Quantity must be greater than zero";
    }
  
    return null;
  };
  