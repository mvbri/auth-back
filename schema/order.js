const Mongoose = require("mongoose");

const OrderSchema = new Mongoose.Schema({
  id: { type: Object }, 
  customer: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: Mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  delivery: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
  cart: { type: Mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  detail: [
    {
      product: { 
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: { type: Number, required: true, min: 1 }, 
      price_unit: { type: Number, required: true, min: 0 }, // Precio unitario del producto
      price_total: { type: Number, required: true, min: 0 }, // Precio total por cantidad
      price_total_iva: { type: Number, required: true, min: 0 }, // Precio total incluyendo IVA
    },
  ],
  status: { type: String, required: true }, // Estado del pedido
  total_delivery: { type: Number, required: true, min: 0 }, // Costo de entrega
  total_products: { type: Number, required: true, min: 0 }, // Total en productos sin IVA
  total_iva: { type: Number, required: true, min: 0 }, // Total del IVA
  total: { type: Number, required: true, min: 0 }, // Total del pedido
});

module.exports = Mongoose.model("Order", OrderSchema);
