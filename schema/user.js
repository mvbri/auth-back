const { Mongoose } = require("mongoose");

const UserSchema = new Mongoose.Schema({
  id: { type: Object },
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
});
