const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const db = require("./DB/db.js");
const router = require("./routes/routes.js");
// const salesforce_router = require("./routes/salesforce_routes.js");

// const conn = require("./conn/conn");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world.?");
});

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use("/", router);
// app.use("/salesforce-api/v1", salesforce_router);

app.listen(port, () => {
  console.log(`App is listening on port ${port}!`);
});
