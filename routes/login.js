const User = require("../schema/user");
const router = require("express").Router();
const getUserInfo = require("../lib/getUserInfo");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const role = "customer";

  if (!!!email || !!!password) {
    return res.status(400).json(
      {
        error: "Rellene todos los campos",
      }
    );
  }

  const user = await User.findOne({ email, role, status: true }).select('+password');
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
          error: "Correo o contraseña incorrecta",
        }
      );
    }
  } else {
    res.status(400).json(
      {
        error: "Correo no encontrado",
      }
    );
  }
});

module.exports = router;
