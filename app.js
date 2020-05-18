const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

mongoose
  .connect(process.env.DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((onfulfilled) =>
    console.log(
      `Conected to Mongo! Database name: ${onfulfilled.connections[0].name}`
    )
  )
  .catch((err) => console.log("Error connecto to Mongo, ", err));

const app = express();

// +++++ PENDIENTE COLOCAR URL DE SITIO ++++++
app.use(cors({
    origin: [process.env.ORIGIN],
    credentials: true
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const tenantsRouter = require("./routes/tenants");
const deviceRouter = require('./routes/devices');


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tenants", tenantsRouter);
app.use("/devices", deviceRouter);
// app.use("/api", indexRouter);

// app.use("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

module.exports = app;
