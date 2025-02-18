const router = require("express").Router();

router.get("/", (require, res) => {
  res.send("user");
});

module.exports = router;
