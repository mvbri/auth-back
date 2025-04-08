const User = require("../schema/user");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const { name, lastName, email, password } = req.body;

  const role = 'customer';

  if (!!!name || !!!lastName || !!!email || !!!password) {
    return res.status(400).json(
      {
        error: "Filds are required",
      }
    );
  }

  // Crear usuario en la base de datos

  try {
    const exists = await User.findOne({ email: email });

    if (exists) {
      return res.status(400).json(
        {
          error: "Email already exists",
        }
      );
    }

    const newUser = new User({ name, lastName, email, password, role });

    newUser.save();

    res
      .status(200)
      .json({message: "User Created successfully"});
  } catch (error) {
    res.status(500).json({
      error: "Error Creating user",
    }
    );
  }
});

module.exports = router;
