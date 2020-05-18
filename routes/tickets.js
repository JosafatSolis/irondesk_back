const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

router.post("/", (req, res, next) => {
  Ticket.create(req.body)
    .then((created) => res.status(200).json({ created }))
    .catch((reason) => res.status(400).json({ error: reason }));
});

module.exports = router;