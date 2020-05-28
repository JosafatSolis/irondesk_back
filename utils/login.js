const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", (req, res, next) => {
  const { email, password } = req.body;
  // Validar que existe el usuario
  User.findOne({ email }).populate("tenant", "name code").then((user) => {
    // Si no encontró al usuario
    if (user === null)
      return res.status(404).json({ msg: "Email no encontrado" });
    // Si sí encontró al usuario, validamos contraseña
    bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        // Armarmamos la respuesta
        const userObject = user.toObject();
        delete userObject.password;
        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
          expiresIn: "1d",
        });
        // Enviamos la respuesta
        res
          .cookie("token", token, {
            expires: new Date(Date.now() + 86400000),
            secure: false,
            httpOnly: true,
          })
          .json({ user: userObject });
      } else {
        res.status(401).json({error: "User or password not found."})
      }
    });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ msg: "logout" });
});

module.exports = router;
