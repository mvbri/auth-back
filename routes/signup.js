const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");

const router = require("express").Router();

router.post("/", (require, res) => {
  const { username, name, password } = require.body;

  if (!!!username || !!!name || !!!password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Filds are required",
      })
    );
  }

  // Crear usuario en la base de datos
  const user = new User({ username, name, password });
  user.save();

  res
    .status(200)
    .json(jsonResponse(200, { message: "User Created successfully" }));
});

module.exports = router;
