const Mongoose = require("mongoose");

const slug = require('mongoose-slug-updater')

Mongoose.plugin(slug)

const CategorySchema = new Mongoose.Schema({
  id: { type: Object }, 
  name: { type: String, require: true },
  description: { type: String},
  slug: {  type: String, slug: "name" , unique: true, index: true, slugPaddingSize: 4 },
});

module.exports = Mongoose.model("Category", CategorySchema);