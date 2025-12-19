const { sql, poolPromise } = require("../db/mssqlClient");

// ===============================
// GET ALL RENTALS
// ===============================
exports.getRentals = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Rentals ORDER BY RentalID DESC");
    res.json(result.recordset || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GET RENTAL BY ID
// ===============================
exports.getRentalById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const id = req.params.id;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Rentals WHERE RentalID = @id");

    if (!result.recordset[0]) return res.status(404).json({ message: "Rental not found" });

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// CREATE RENTAL
// ===============================
exports.createRental = async (req, res) => {
  try {
    const { CustomerID, VehicleID, PickupDate, ReturnDate, RentTotAmt } = req.body;

    const pool = await poolPromise;

    // INSERT RENTAL
    await pool.request()
      .input("cid", sql.Int, CustomerID)
      .input("vid", sql.Int, VehicleID)
      .input("pd", sql.DateTime, PickupDate)
      .input("rd", sql.DateTime, ReturnDate)
      .input("amt", sql.Decimal(10,2), RentTotAmt)
      .query(`
        INSERT INTO Rentals (CustomerID, VehicleID, PickupDate, ReturnDate, RentTotAmt, RentalStatus)
        VALUES (@cid, @vid, @pd, @rd, @amt, 'Booked')
      `);

    // UPDATE VEHICLE AVAILABILITY
    await pool.request()
      .input("vid", sql.Int, VehicleID)
      .query("UPDATE Vehicles SET VehAvai='Rented' WHERE VehicleID=@vid");

    res.json({ message: "Rental created successfully" });
  } catch (err) {
    console.error("Error creating rental:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// UPDATE RENTAL (RETURN VEHICLE)
// ===============================
exports.updateRental = async (req, res) => {
  try {
    const { RentalStatus, ActualReturnDate } = req.body;
    const id = req.params.id;

    const pool = await poolPromise;

    // Update rental status
    await pool.request()
      .input("id", sql.Int, id)
      .input("st", sql.VarChar(20), RentalStatus)
      .input("ard", sql.DateTime, ActualReturnDate || null)
      .query(`
        UPDATE Rentals
        SET RentalStatus=@st, ActualReturnDate=@ard
        WHERE RentalID=@id
      `);

    // If rental completed → free the vehicle
    if (RentalStatus === "Completed") {
      const rental = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT VehicleID FROM Rentals WHERE RentalID=@id");

      await pool.request()
        .input("vid", sql.Int, rental.recordset[0].VehicleID)
        .query("UPDATE Vehicles SET VehAvai='Available' WHERE VehicleID=@vid");
    }

    res.json({ message: "Rental updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE RENTAL
// ===============================
exports.deleteRental = async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPromise;

    const rental = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT VehicleID FROM Rentals WHERE RentalID=@id");

    if (rental.recordset[0]) {
      await pool.request()
        .input("vid", sql.Int, rental.recordset[0].VehicleID)
        .query("UPDATE Vehicles SET VehAvai='Available' WHERE VehicleID=@vid");
    }

    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Rentals WHERE RentalID=@id");

    res.json({ message: "Rental deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GET RENTALS JOIN (Customer + Vehicle)
// ===============================
exports.getRentalsJoin = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        R.RentalID, 
        C.CustName,
        V.VehModel,
        R.PickupDate,
        R.ReturnDate,
        R.RentTotAmt,
        R.RentalStatus
      FROM Rentals R
      JOIN Customers C ON R.CustomerID = C.CustomerID
      JOIN Vehicles V ON R.VehicleID = V.VehicleID
      ORDER BY R.RentalID DESC
    `);

    res.json(result.recordset || []);
  } catch (err) {
    console.error("JOIN fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT VehicleID, VehModel, VehRentRatePerDay, VehAvai
      FROM Vehicles
      WHERE VehAvai = 'Available'
      ORDER BY VehicleID DESC
    `);

    res.json(result.recordset || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
