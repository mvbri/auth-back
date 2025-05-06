const User = require("../schema/user");
const router = require("express").Router();
const getUserInfo = require("../lib/getUserInfo");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const role = ["admin", "delivery"];

  if (!!!email || !!!password) {
    return res.status(400).json(
      {
        error: "Filds are required",
      }
    );
  }

  const user = await User.findOne({ email, role : {  $in: role } });
  if (user) {
    const correctPassword = await user.comparePassword(password, user.password);

    if (correctPassword) {
      const accessToken = user.createAccessToken();
      const refreshToken = await user.createRefreshToken();

      res.status(200).json(
         {
          user: getUserInfo(user),
          accessToken,
          refreshToken,
        }
      );
    } else {
      res.status(400).json(
        {
          error: "User or password incorrect",
        }
      );
    }
  } else {
    res.status(400).json(
      {
        error: "User not found",
      }
    );
  }
});

module.exports = router;
