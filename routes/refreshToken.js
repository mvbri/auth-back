const { generateAccessToken } = require("../auth/generateTokens");
const getTokenFromHeader = require("../auth/getTokenFromHeader");
const { verifyRefreshToken } = require("../auth/verifyTokens");
const { jsonResponse } = require("../lib/jsonResponse");
const Token = require("../schema/token");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const refreshToken = getTokenFromHeader(req.headers);

  if (!refreshToken)
    return res
      .status(401)
      .json(jsonResponse(401, { error: "Unauthorized: Missing token" }));

  try {
    const found = await Token.findOne({ token: refreshToken });

    if (!found)
      return res
        .status(401)
        .json(jsonResponse(401, { error: "Unauthorized: Token not found" }));

    const payload = verifyRefreshToken(found.token);

    if (!payload)
      return res
        .status(401)
        .json(jsonResponse(401, { error: "Unauthorized: Invalid token" }));
        
    const accessToken = generateAccessToken(payload.user);

    return res.status(200).json(jsonResponse(200, { accessToken }));
  } catch (error) {
    return res
      .status(401)
      .json(jsonResponse(401, { error: "Internal Server Error" }));
  }
});

module.exports = router;
