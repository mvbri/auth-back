const getTokenFromHeader = require("../auth/getTokenFromHeader");
const router = require("express").Router();
const Token = require("../schema/token");

router.delete("/", async (req, res) => {
  try {
    const refreshToken = getTokenFromHeader(req.headers);

    if (refreshToken) {
      await Token.findOneAndDelete({ token: refreshToken });
      res.status(200).json( { message: "Token deleted" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
