const { jsonResponse } = require("../lib/jsonResponse");

const router = require("express").Router();

router.post("/", (require, res) => {
  const { username, password } = require.body;

  if (!!!username || !!!password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Filds are required",
      })
    );
  }

  // Autenticar Usuario
  const accessToken = "access_token";
  const refreshToken = "refresh_token";
  const user = {
    id: "1",
    name: "John Doe",
    username: "xxxxxx",
  };

  res.status(200).json(jsonResponse(200, { user, accessToken, refreshToken }));
});

module.exports = router;
