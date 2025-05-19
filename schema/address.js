const Mongoose = require("mongoose");

const AddressSchema = new Mongoose.Schema({
  id: { type: Object }, 
  customer: { type: Mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  parish: { type: String, require: true },
  address: { type: String, require: true },
  phone: { type: String, require: true }
});

module.exports = Mongoose.model("Address", AddressSchema);