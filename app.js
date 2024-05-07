require("dotenv").config();
// Routes
const routes = require("./routes");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const fileupload = require("express-fileupload");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", routes);

app.get("/", (req, res) => {
  return res.json({ message: "Deep api is running" });
});

app.use((err, req, res) => {
  err.status = err.status || 500;
  console.log(err);
  res.status(err.status).json({
    status: false,
    message: "Internal server error",
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
