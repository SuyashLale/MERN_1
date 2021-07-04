/**
 * Import Core Modules
 */
const { readdirSync } = require("fs");

/**
 * Import 3rd party modules
 */
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

/**
 * Express App
 */
const app = express();

/**
 * Database Connection
 */
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("DB Connection Successful!"))
  .catch((error) => console.log(`DB Connection Error ${error}`));

/**
 * Middlewares
 */
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

/**
 * Invoke Routes
 * Can be implemented by applying these as MWs.
 * Use the readdirSync method to read all the files and import them
 */
readdirSync("./routes").map((route) =>
  app.use("/api", require("./routes/" + route))
);

/**
 * Start Listening
 */
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is now runnning on port: ${port}`));
