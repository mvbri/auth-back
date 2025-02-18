const router = require("express").Router();

router.get("/", (require, res) => {
  res.send("refreshtoken");
});

module.exports = router;
