const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticate = require("./auth/authenticate");
const product = require("./routes/product");
const category = require("./routes/category");
const upload = require("./lib/upload");
const path = require("path");
const isAdmin = require("./auth/isAdmin");

require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/public", express.static(path.join(__dirname, "public")));

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log("Connected to MongoBD");
}

main().catch(console.error);

// admin routes
app.get("/api/admin/products/", [authenticate, isAdmin], product.index);

app.get("/api/admin/category/", [authenticate, isAdmin], category.index);

app.get(
  "/api/admin/products/:productId",
  [authenticate, isAdmin],
  product.show
);

app.put("/api/admin/products/:productId", [upload.any()], product.update);

app.delete(
  "/api/admin/products/:productId",
  [authenticate, isAdmin],
  product.destroy
);

app.delete(
  "/api/admin/image/:imageId",
  [authenticate, isAdmin],
  product.destroyImage
);

app.post(
  "/api/admin/products",
  [upload.any(), authenticate, isAdmin],
  product.create
);

app.use("/api/admin/login", require("./routes/loginAdmin"));

// customer routes

app.get("/api/category/", category.index); // get categories

app.get("/api/category/:slug", category.show); // get category by slug and products

app.get("/api/product/:slug", product.showBySlug); // get product by slug url

app.use("/api/login", require("./routes/login"));

app.use("/api/signout", require("./routes/signout"));

app.use("/api/refresh-token", require("./routes/refreshToken"));

app.use("/api/signup", require("./routes/signup"));

app.use("/api/user", authenticate, require("./routes/user"));

// app.get("/", (require, res) => {
//   res.send("Hello Word!!");
// });

app.listen(port, () => {
  console.log(`Sever is runing on port ${port}`);
});
