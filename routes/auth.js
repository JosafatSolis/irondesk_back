const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  // Validar que existe el usuario
  User.findOne({ email }).then((user) => {
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
      }
    });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ msg: "logout" });
});

exports.verifyToken = (req, res, next) => {
  // Extrae el id del token
  const { token } = req.cookies;
  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) return res.status(401).json({ error });
    // Ya con el id, busca el objeto en la BD y lo inserta en el request
    User.findById(decoded.id).then((user) => {
      req.user = user;
      next();
    });
  });
};

module.exports = router;
