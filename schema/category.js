const Mongoose = require("mongoose");


const CategorySchema = new Mongoose.Schema({
  id: { type: Object },
  name: { type: String, require: true },
  description: { type: String},  
});


module.exports = Mongoose.model("Category", CategorySchema);