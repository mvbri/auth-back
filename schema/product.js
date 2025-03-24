const Mongoose = require("mongoose");


const ProductSchema = new Mongoose.Schema({
  id: { type: Object },
  name: { type: String, require: true },
  description: { type: String, require: true },
  stock: { type: Number, require: true },
  price: { type: Number, require: true },
  priceIVA: { type: Number, require: true },
  images: [{
    type: Mongoose.Schema.Types.ObjectId, 
    ref: 'Image',
  }],
  category: [{
    type: Mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
  }]
});


module.exports = Mongoose.model("Product", ProductSchema);