const { sql, poolPromise } = require("../db/mssqlClient");

// ===============================
// GET ALL PAYMENTS
// ===============================
exports.getPayments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT *
      FROM Payments
      ORDER BY PaymentID DESC
    `);

    res.json(result.recordset || []);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GET PAYMENTS WITH JOIN
// ===============================
exports.getPaymentsJoin = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        P.PaymentID,
        P.PayAmount,
        P.PaymentMethod,
        P.TransactionID,
        P.PaymentDate,
        C.CustName,
        V.VehModel,
        R.PickupDate,
        R.ReturnDate
      FROM Payments P
      JOIN Rentals R ON P.RentalID = R.RentalID
      JOIN Customers C ON R.CustomerID = C.CustomerID
      JOIN Vehicles V ON R.VehicleID = V.VehicleID
      ORDER BY P.PaymentID DESC
    `);

    res.json(result.recordset || []);
  } catch (err) {
    console.error("JOIN Payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// CREATE PAYMENT
// ===============================
exports.createPayment = async (req, res) => {
  try {
    const { RentalID, PayAmount, PaymentMethod, TransactionID } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("rid", sql.Int, RentalID)
      .input("amt", sql.Decimal(10, 2), PayAmount)
      .input("pm", sql.VarChar(50), PaymentMethod)
      .input("tid", sql.VarChar(100), TransactionID)
      .query(`
        INSERT INTO Payments (RentalID, PayAmount, PaymentMethod, TransactionID)
        VALUES (@rid, @amt, @pm, @tid)
      `);

    res.json({ message: "Payment added successfully" });
  } catch (err) {
    console.error("Create payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE ONE PAYMENT
// ===============================
exports.deletePayment = async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Payments WHERE PaymentID=@id");

    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Delete payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE ALL PAYMENTS
// ===============================
exports.deleteAllPayments = async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request().query("DELETE FROM Payments");

    res.json({ message: "All payments deleted successfully" });
  } catch (err) {
    console.error("Delete all payments error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// SEARCH PAYMENTS
// ===============================
exports.searchPayments = async (req, res) => {
  try {
    const kw = req.params.keyword;
    const pool = await poolPromise;

    const result = await pool.request()
      .input("kw", sql.VarChar(100), `%${kw}%`)
      .query(`
        SELECT 
          P.*, 
          C.CustName, 
          V.VehModel
        FROM Payments P
        JOIN Rentals R ON P.RentalID = R.RentalID
        JOIN Customers C ON R.CustomerID = C.CustomerID
        JOIN Vehicles V ON R.VehicleID = V.VehicleID
        WHERE 
          C.CustName LIKE @kw OR
          V.VehModel LIKE @kw OR
          P.PaymentMethod LIKE @kw OR
          P.TransactionID LIKE @kw
        ORDER BY P.PaymentID DESC
      `);

    res.json(result.recordset || []);
  } catch (err) {
    console.error("Search payment error:", err);
    res.status(500).json({ error: err.message });
  }
};
