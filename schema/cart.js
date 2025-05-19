const Mongoose = require("mongoose");

const CartSchema = new Mongoose.Schema({
  id: { type: Object }, // Este campo puede ser opcional si no se utiliza.
  customer: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  detail: [ // Cambiado de `products` a `detail`
    {
      product: { // Referencia al producto
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: { type: Number, required: true, min: 1 }, // Cantidad del producto
    },
  ],
  total_quantity: { type: Number, min: 0 }, // Cantidad de productos
  ordered: { type: Boolean, default: false }, // Campo booleano que indica si el carrito ha sido ordenado
  total_delivery: { type: Number, required: true, min: 0 }, // Costo de entrega
  total_products: { type: Number, required: true, min: 0 }, // Total en productos sin IVA
  total_iva: { type: Number, required: true, min: 0 }, // Total del IVA
  total: { type: Number, required: true, min: 0 }, // Total del pedido
});

module.exports = Mongoose.model("Cart", CartSchema);
