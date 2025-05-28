const Mongoose = require("mongoose");

const slug = require('mongoose-slug-updater')

Mongoose.plugin(slug)

const ProductSchema = new Mongoose.Schema({
  id: { type: Object },
  name: { type: String, require: true },
  description: { type: String, require: true },
  stock: { type: Number, require: true },
  price: { type: Number, require: true },
  priceIVA: { type: Number, require: true },
  slug: { type: String, slug: "name", unique: true, index: true, slugPaddingSize: 4 },
  images: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  }],
  category: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  status: {
    type: Boolean,
    default: false
  }, // Campo booleano que indica si el producto esta activo
});

module.exports = Mongoose.model("Product", ProductSchema);