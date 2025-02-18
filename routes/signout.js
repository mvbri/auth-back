const router = require("express").Router();

router.get("/", (require, res) => {
  res.send("signout");
});

module.exports = router;
