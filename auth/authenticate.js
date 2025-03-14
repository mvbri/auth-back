const { verifyAccessToken } = require("./verifyTokens");
const getTokenFromHeader = require("./getTokenFromHeader");

function authenticate(req, res, next) {
  const token = getTokenFromHeader(req.headers);

  if (token) {
    const decoded = verifyAccessToken(token);

    if (decoded) {
      req.user = { ...decoded.user };
      next();
    } else {
      res.status(401).json(401, {
        message: "No token provided",
      });
    }
  } else {
    res.status(401).json(401, {
      message: "No token provided",
    });
  }
}

module.exports = authenticate;
