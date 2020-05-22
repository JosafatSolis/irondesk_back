const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const {verifyToken} = require("../utils/verifyToken");
const { checkRole } = require("../utils/checkRole");


// GET ROUTE ALL
router.get("/", verifyToken, checkRole(["Tecnician", "Admin"]), function (req, res, next) {
    Tenant.find()
      .then((tenants) => res.status(200).json(tenants))
      .catch((reason) => {
        console.log("Error: ", reason);
        res.status(400).json({ error: reason });
      });
  });

//GET ROUTE ID
router.get("/:id", verifyToken, checkRole(["User", "Tecnician", "Admin"]), (req, res, next) => {
    const { id } = req.params;
    Tenant.findById(id).then(found => {
        if (found) {
            res.status(200).json(found);
        } else {
            // Pueden darse ambos casos, que no encuentre..
            console.log("Empty.....");
            res.status(404).json({});
        }
    }).catch(reason => {
        // O que ocurra un error si el id no viene en el formato correcto.
        console.log("Error: ", reason);
        res.status(404).json({error: reason});
    })
});

// CREATE ROUTE 
router.post("/", verifyToken, checkRole(["Admin"]), (req, res) => {
    Tenant.create(req.body).then(created => {
        console.log(created);
        res.status(200).json({created});
    }).catch(err => {
        console.log("Error: ", err);
        res.status(400).json({error: err});
    })
})

// UPDATE ROUTE 
router.patch("/:id", verifyToken, checkRole(["Admin"]), (req, res, next) => {
    const { id } = req.params;
    // Note that new returns the updated version
    Tenant.findByIdAndUpdate(id, req.body, { new: true })
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
  
  //DELETE ROUTE 
  router.delete("/:id", verifyToken, checkRole(["Admin"]), (req, res, next) => {
    const { id } = req.params;
    Tenant.findByIdAndDelete(id)
      .then((deleted) => res.status(200).json({ deleted }))
      .catch((reason) => res.status(400).json({ error: reason }));
  });
  

module.exports = router;