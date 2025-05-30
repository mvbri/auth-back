const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../auth/generateTokens");

const Token = require("../schema/token");
const getUserInfo = require("../lib/getUserInfo");

const UserSchema = new Mongoose.Schema({
  id: { type: Object },
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true ,select: false },
  question: { type: String },
  answer: { type: String,  select: false },
  role: { type: String, require: true },
  phone: { type: String, require: true },
  status: { type: Boolean, default: true }, // Campo booleano que indica si el usuario esta activo
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
  } 
  else {
    next();
  }
});

UserSchema.pre("save", function (next) {
 if(this.isModified("answer") || this.isNew){
    const document = this;

    bcrypt.hash(document.answer, 10, (err, hash) => {
      if (err) {
        next(err);
      } else {
        document.answer = hash;
        next();
      }
    });
  }
  else {
    next();
  }
});

UserSchema.methods.emailExists = async function (email) {
  const result = await Mongoose.model("User").find({ email });
  return result.length > 0;
};

UserSchema.methods.comparePassword = async function (password, hash) {
  const same = await bcrypt.compare(password, hash);
  return same;
};


UserSchema.methods.createAccessToken = function () {
  return generateAccessToken(getUserInfo(this));
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
