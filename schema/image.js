const Mongoose = require("mongoose");


const ImageSchema = new Mongoose.Schema({
  id: { type: Object },
  product_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'Product' , require: true },
  url: { type: String, require: true },
  product: {
    type: Mongoose.Schema.Types.ObjectId, // Referencia al Producto
    ref: 'Product', // Referencia al modelo Product
  }
});


module.exports = Mongoose.model("Image", ImageSchema);