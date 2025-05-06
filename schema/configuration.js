const Mongoose = require("mongoose");


const ConfigurationSchema = new Mongoose.Schema({
  id: { type: Object },
  name: { type: String, require: true, unique: true },
  value: { type: String, require: true },
});


module.exports = Mongoose.model("Configuration", ConfigurationSchema);