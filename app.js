const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticate = require("./auth/authenticate");
const product = require("./routes/product");
const order = require("./routes/order");
const cart = require("./routes/cart");
const category = require("./routes/category");
const {uploadProducts, uploadCategory} = require("./lib/upload");
const path = require("path");
const isAdmin = require("./auth/isAdmin");
const users = require("./routes/users");
const address = require("./routes/address");


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

app.get("/api/admin/users/delivery", [authenticate, isAdmin], users.getDeliveries);

app.get(
  "/api/admin/users/delivery/:userId",
  [authenticate, isAdmin],
  users.getDelivery
);

app.put("/api/admin/users/delivery/:userId", [authenticate, isAdmin], users.updateDelivery);

app.delete(
  "/api/admin/users/delivery/:userId",
  [authenticate, isAdmin],
  users.deleTeDelivery
);

app.post(
  "/api/admin/products",
  [ authenticate, isAdmin],
  users.createDelivery
);


app.get("/api/admin/products/", [authenticate, isAdmin], product.index);

app.get("/api/admin/category/", [authenticate, isAdmin], category.index);

app.post("/api/admin/category/", [uploadCategory.single('image')/*, authenticate, isAdmin*/], category.create);

app.put("/api/admin/category/:categoryId", [uploadCategory.single('image')/*, authenticate, isAdmin*/], category.update);

app.delete("/api/admin/category/:categoryId", [/*, authenticate, isAdmin*/], category.destroy);

app.get(
  "/api/admin/products/:productId",
  [authenticate, isAdmin],
  product.show
);

app.put("/api/admin/products/:productId", [uploadProducts.any()], product.update);

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
  [uploadProducts.any(), authenticate, isAdmin],
  product.create
);

app.get(
  "/api/admin/addresses",
  [authenticate, isAdmin],
  address.adminIndex
);

app.use("/api/admin/login", require("./routes/loginAdmin"));

// customer routes

app.get(
  "/api/address",
  [authenticate],
  address.index
);

app.post(
  "/api/address",
  [authenticate],
  address.create
);


app.get(
  "/api/address/:addressId",
  [authenticate],
  address.show
);


app.put(
  "/api/address/:addressId",
  [authenticate],
  address.update
);

app.delete(
  "/api/address/:addressId",
  [authenticate],
  address.destroy
);

app.post(
  "/api/orders",
  [authenticate],
  order.create
);

app.get(
  "/api/cart",
  [authenticate],
  cart.getCart
);

app.post(
  "/api/cart",
  [authenticate],
  cart.add
);

app.put(
  "/api/cart",
  [authenticate],
  cart.updateQuantity
);

app.put(
  "/api/cart/remove",
  [authenticate],
  cart.remove
);

app.put(
  "/api/cart/remove/all",
  [authenticate],
  cart.removeAll
);


app.get("/api/product/search", product.search); // get products

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
