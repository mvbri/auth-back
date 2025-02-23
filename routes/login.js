const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");

const router = require("express").Router();

router.post("/", async (require, res) => {
  const { username, password } = require.body;

  if (!!!username || !!!password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Filds are required",
      })
    );
  }

  const user = await User.findOne({ username });

  if (user) {
    const correctPassword = await user.comparePassword(password, user.password);

    if (correctPassword) {
      const accessToken = "access_token";
      const refreshToken = "refresh_token";

      res
        .status(200)
        .json(jsonResponse(200, { user, accessToken, refreshToken }));
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
