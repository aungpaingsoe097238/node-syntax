require("dotenv").config();
require("./database/connection");
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const port = process.env.PORT;

/** Import routes */
const v1AuthRoutes = require("./routes/v1/admin/auth.routes");

app.use(express.json());
app.use(fileUpload());
app.use("/public/uploads", express.static("public/uploads"));
app.use(cors({ origin: "*" }));

/** Routes */
app.use("/api/v1/admin/auth", v1AuthRoutes);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
