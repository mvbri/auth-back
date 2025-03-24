const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");
const router = require("express").Router();
const getUserInfo = require("../lib/getUserInfo");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const role = "admin";

  if (!!!email || !!!password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Filds are required",
      })
    );
  }

  const user = await User.findOne({ email, role});
  if (user) {
    const correctPassword = await user.comparePassword(password, user.password);

    if (correctPassword) {
      const accessToken = user.createAccessToken();
      const refreshToken = await user.createRefreshToken();

      res.status(200).json(
        jsonResponse(200, {
          user: getUserInfo(user),
          accessToken,
          refreshToken,
        })
      );
    } else {
      res.status(400).json(
        jsonResponse(400, {
          error: "User or password incorrect",
        })
      );
    }
  } else {
    res.status(400).json(
      jsonResponse(400, {
        error: "User not found",
      })
    );
  }
});

module.exports = router;
