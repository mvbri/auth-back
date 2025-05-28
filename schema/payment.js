const Mongoose = require("mongoose");

const PaymentSchema = new Mongoose.Schema({
  id: { type: Object },
  name: { type: String, require: true },
  document: { type: String, require: true },
  bank: { type: String, require: true },
  number: { type: String, require: true },
  type: { type: String, require: true },
  status: { type: Boolean, default: true }, // Campo booleano que indica si el metodo de pago esta activo
});

module.exports = Mongoose.model("Payment", PaymentSchema);