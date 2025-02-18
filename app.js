const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/signup", require("./routes/signup"));
app.use("/api/user", require("./routes/user"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signout", require("./routes/signout"));
app.use("/api/refresh-token", require("./routes/refreshToken"));

app.get("/", (require, res) => {
  res.send("Hello Word!!");
});

app.listen(port, () => {
  console.log(`Sever is runing on port ${port}`);
});
