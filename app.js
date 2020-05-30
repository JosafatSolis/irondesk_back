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
    origin: [process.env.ORIGIN, "http://localhost:3000", "http://irondesk.herokuapp.com"],
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
const devicesRouter = require("./routes/devices");
const ticketsRouter = require("./routes/tickets");
const authLogin = require ("./utils/login");

//app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/tenants", tenantsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/login", authLogin);
app.use("/api", indexRouter);

 app.use("*", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
 });

module.exports = app;
