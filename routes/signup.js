const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../schema/user");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { name, lastName, email, password } = req.body.values;

  const role = 'customer';

  if (!!!name || !!!lastName || !!!email || !!!password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Filds are required",
      })
    );
  }

  // Crear usuario en la base de datos

  try {
    const user = new User();
    const exists = await user.usernameExists(email);

    if (exists) {
      return res.status(400).json(
        jsonResponse(400, {
          error: "Email already exists",
        })
      );
    }

    const newUser = new User({ name, lastName, email, password, role });

    newUser.save();

    res
      .status(200)
      .json(jsonResponse(200, { message: "User Created successfully" }));
  } catch (error) {
    res.status(500).json(
      jsonResponse(500, {
        error: "Error Creating user",
      })
    );
  }
});

module.exports = router;
