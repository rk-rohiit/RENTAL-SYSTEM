const express = require("express");
const router = express.Router();
const VehiclesController = require("../controllers/vehiclesController");

// GET AVAILABLE VEHICLES (for rental form)
router.get("/available", VehiclesController.getAvailableVehicles);

// GET ALL VEHICLES
router.get("/", VehiclesController.getAllVehicles);

// GET VEHICLE BY ID
router.get("/:id", VehiclesController.getVehicleById);

// CREATE VEHICLE
router.post("/", VehiclesController.createVehicle);

// UPDATE VEHICLE
router.put("/:id", VehiclesController.updateVehicle);

// DELETE VEHICLE
router.delete("/:id", VehiclesController.deleteVehicle);
router.get("/filter", VehiclesController.filterVehicles);
router.get("/sort/:key", VehiclesController.sortVehicles);
router.get("/search/:keyword", VehiclesController.searchVehicles);


// VERY IMPORTANT
module.exports = router;
