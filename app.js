const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticate = require("./auth/authenticate");
const product = require("./routes/product");
const order = require("./routes/order");
const cart = require("./routes/cart");
const category = require("./routes/category");
const { uploadProducts, uploadCategory, uploadSlider, uploadVoucher, uploadBackup } = require("./lib/upload");
const path = require("path");
const isAdmin = require("./auth/isAdmin");
const isDelivery = require("./auth/isDelivery");
const users = require("./routes/users");
const address = require("./routes/address");
const pdf = require("./routes/pdf");
const backups = require("./routes/backups");
const payments = require("./routes/payments");


require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/public", express.static(path.join(__dirname, "public")));

async function main() {
  await mongoose.connect(`${process.env.DB_CONNECTION_URL}/${process.env.DB_CONNECTION_NAME}`);
  console.log("Connected to MongoBD");
}

main().catch(console.error);


app.get('/api/backup',[authenticate, isAdmin], backups.index );

app.post('/api/backup/upload',[uploadBackup.single('file'),authenticate, isAdmin], backups.index );

app.post('/api/backup/generate',[authenticate, isAdmin], backups.generate );

app.post('/api/backup/restore',[authenticate, isAdmin], backups.restore );

app.post('/api/backup/destroy',[authenticate, isAdmin], backups.destroy );

app.get('/api/backup/download', backups.download );


app.post(
  "/api/orders",
  [uploadVoucher.single('image'),
    authenticate],
  order.store
);

// admin routes

app.get("/api/admin/payments/", [authenticate, isAdmin], payments.index);

app.post("/api/admin/payments/", [authenticate, isAdmin], payments.create);

app.get("/api/admin/payments/:paymentId", [authenticate, isAdmin], payments.show);

app.put("/api/admin/payments/:paymentId", [ authenticate, isAdmin], payments.update);

app.delete("/api/admin/payments/:paymentId", [authenticate, isAdmin], payments.destroy);



app.use("/api/admin/order/report/:startDate/:endDate", pdf.orderPdf);

app.get("/api/admin/report", pdf.dataReport);

app.post("/api/admin/report", pdf.order);


app.get("/api/admin/ordersData/", [authenticate, isAdmin], order.getOrdersData);

app.get("/api/admin/orders/", [authenticate, isAdmin], order.index);

app.get("/api/admin/orders/:orderId", [authenticate, isAdmin], order.adminShow);

app.put("/api/admin/orders/:orderId", [authenticate, isAdmin], order.update);

app.get("/api/admin/users/delivery", [authenticate, isAdmin], users.getDeliveries);

app.get("/api/admin/users/cliente", [authenticate, isAdmin], users.getCustomers);

app.get("/api/admin/users/admin", [authenticate, isAdmin], users.getAdmins);

app.get(
  "/api/admin/users/:userId",
  [authenticate, isAdmin],
  users.getUser
);

app.put("/api/admin/users/:userId", [authenticate, isAdmin], users.updateUser);

app.delete(
  "/api/admin/users/:userId",
  [authenticate, isAdmin],
  users.deleteUser
);


app.post(
  "/api/admin/users/delivery",
  [authenticate, isAdmin],
  users.createDelivery
);

app.post(
  "/api/admin/users/cliente",
  [authenticate, isAdmin],
  users.createCustomer
);

app.post(
  "/api/admin/users/admin",
  [authenticate, isAdmin],
  users.createAdmin
);


app.get("/api/admin/products/", [authenticate, isAdmin], product.index);

app.get("/api/admin/category/", [authenticate, isAdmin], category.index);

app.post("/api/admin/category/", [uploadCategory.single('image'),authenticate, isAdmin], category.create);

app.get("/api/admin/category/:categoryId", [authenticate, isAdmin], category.show);

app.put("/api/admin/category/:categoryId", [uploadCategory.single('image'), authenticate, isAdmin], category.update);

app.delete("/api/admin/category/:categoryId", [authenticate, isAdmin], category.destroy);

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

app.post(
  "/api/admin/addresses",
  [authenticate, isAdmin],
  address.create
);

app.get(
  "/api/admin/addresses/:addressId",
  [authenticate, isAdmin],
  address.show
);

app.put(
  "/api/admin/addresses/:addressId",
  [authenticate, isAdmin],
  address.update
);

app.delete(
  "/api/admin/addresses/:addressId",
  [authenticate, isAdmin],
  address.destroy
);

app.use("/api/admin/login", require("./routes/loginAdmin"));

// customer routes

app.get(
  "/api/orders",
  [authenticate],
  order.customerIndex
);

app.get(
  "/api/orders/:orderId",
  [authenticate],
  order.show
);

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

app.get(
  "/api/checkout/",
  [authenticate],
  order.checkout
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

app.get("/api/category/:slug", category.showBySlug); // get category by slug and products

app.get("/api/product/:slug", product.showBySlug); // get product by slug url

app.use("/api/login", require("./routes/login"));

app.use("/api/signout", require("./routes/signout"));

app.use("/api/refresh-token", require("./routes/refreshToken"));

app.use("/api/signup", require("./routes/signup"));

app.get("/api/user", authenticate, cart.getCart);

app.post("/api/user/update", authenticate, users.updateSession);

app.post("/api/user/reset/:step", users.passwordReset);


// delivery routes

app.get("/api/delivery/orders/", [authenticate, isDelivery], order.deliveryIndex);

app.get("/api/delivery/orders/:orderId", [authenticate, isDelivery], order.adminShow);
app.put("/api/delivery/orders/:orderId", [authenticate, isDelivery], order.update);

// app.get("/", (require, res) => {
//   res.send("Hello Word!!");
// });

app.listen(port, () => {
  console.log(`Sever is runing on port ${port}`);
});
