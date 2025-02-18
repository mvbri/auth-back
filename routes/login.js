const router = require("express").Router();

router.get("/", (require, res) => {
  res.send("login");
});

module.exports = router;
