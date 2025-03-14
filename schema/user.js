const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  generateAccesToken,
  generateRefreshToken,
} = require("../auth/generateTokens");

const Token = require("../schema/token");
const getUserInfo = require("../lib/getUserInfo");

const UserSchema = new Mongoose.Schema({
  id: { type: Object },
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) {
        next(err);
      } else {
        document.password = hash;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.usernameExists = async function (username) {
  const result = await Mongoose.model("User").find({ username });
  return result.length > 0;
};

UserSchema.methods.comparePassword = async function (password, hash) {
  const same = await bcrypt.compare(password, hash);
  return same;
};

UserSchema.methods.createAccesToken = function () {
  return generateAccesToken(getUserInfo(this));
};

UserSchema.methods.createRefreshToken = async function () {
  const refreshToken = generateRefreshToken(getUserInfo(this));

  try {
    await new Token({ token: refreshToken }).save();

    return refreshToken;
  } catch (error) {
    console.log(error);
  }
};

module.exports = Mongoose.model("User", UserSchema);
