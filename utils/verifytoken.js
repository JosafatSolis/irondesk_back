const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
  