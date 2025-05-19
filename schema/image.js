const Mongoose = require("mongoose");


const ImageSchema = new Mongoose.Schema({
  id: { type: Object },
  product: { type: Mongoose.Schema.Types.ObjectId, ref: 'Product' },
  category: { type: Mongoose.Schema.Types.ObjectId, ref: 'Category' },
  slider: { type: Boolean, default: false },
  url: { type: String, require: true }  
});


module.exports = Mongoose.model("Image", ImageSchema);