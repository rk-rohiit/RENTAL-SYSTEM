const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db/mssqlClient");

/* DASHBOARD STATS */
router.get("/stats", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        (SELECT COUNT(*) FROM Customers) AS totalCustomers,
        (SELECT COUNT(*) FROM Vehicles) AS totalVehicles,
        (SELECT ISNULL(SUM(PayAmount), 0) FROM Payments) AS totalRevenue,
        (SELECT COUNT(*) FROM Rentals WHERE RentalStatus = 'Active') AS activeRentals,
        (SELECT COUNT(*) FROM Vehicles WHERE VehAvai = 'Available') AS availableVehicles,
        (SELECT COUNT(*) FROM Vehicles WHERE VehAvai = 'Rented') AS rentedVehicles,
        (SELECT COUNT(*) FROM Vehicles WHERE VehAvai = 'Maintenance') AS maintenanceVehicles
    `);

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* CUSTOMERS LIST */
router.get("/customers", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * 
      FROM Customers
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/* VEHICLES LIST */
router.get("/vehicles", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * from Vehicles
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
