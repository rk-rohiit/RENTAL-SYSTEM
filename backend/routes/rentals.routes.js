const express = require("express");
const router = express.Router();
const RentalsController = require("../controllers/rentalsController");

// JOIN LIST (Customer + Vehicle + Rentals)
router.get("/join", RentalsController.getRentalsJoin);

// GET ALL RENTALS
router.get("/", RentalsController.getRentals);

// GET RENTAL BY ID
router.get("/:id", RentalsController.getRentalById);

// CREATE RENTAL
router.post("/", RentalsController.createRental);

// UPDATE RENTAL
router.put("/:id", RentalsController.updateRental);

// DELETE RENTAL
router.delete("/:id", RentalsController.deleteRental);

module.exports = router;
