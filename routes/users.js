const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require ("bcrypt");
const {verifyToken} = require("./auth");

router.get("/", verifyToken, function (req, res, next) {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((reason) => {
      console.log("Error: ", reason);
      res.status(400).json({ error: reason });
    });
});

router.get("/:id", verifyToken, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((found) => {
      if (found) {
        res.status(200).json(found);
      } else {
        // Pueden darse ambos casos, que no encuentre..
        console.log("Empty.....");
        res.status(404).json({});
      }
    })
    .catch((reason) => {
      // O que ocurra un error si el id no viene en el formato correcto.
      console.log("Error: ", reason);
      res.status(404).json({ error: reason });
    });
});

router.post("/", verifyToken, (req, res) => {
  const { password, ...userValues } = req.body;
  bcrypt.hash(password, 10).then((hashedPassword) => {
    const user = { ...userValues, password: hashedPassword };
  });
  User.create(user)
    .then((created) => {
      console.log(created);
      res.status(200).json({ created });
    })
    .catch((err) => {
      console.log("Error: ", err);
      res.status(400).json({ error: err });
    });
});

router.patch("/:id", verifyToken, (req, res, next) => {
  const { id } = req.params;
  // Note that new returns the updated version
  User.findByIdAndUpdate(id, req.body, { new: true })
    .then((updated) => {
      if (updated) {
        res.status(200).json(updated);
      } else {
        console.log("Error: Updated fail, not found.");
        res.status(404).json({});
      }
    })
    .catch((reason) => res.status(400).json({ error: reason }));
});

router.delete("/:id", verifyToken, (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then((deleted) => res.status(200).json({ deleted }))
    .catch((reason) => res.status(400).json({ error: reason }));
});

module.exports = router;
