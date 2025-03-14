const jwt = require("jsonwebtoken");

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(error);
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.log(`${error} Token malformed`);
  }
}

module.exports = { verifyAccessToken, verifyRefreshToken };
