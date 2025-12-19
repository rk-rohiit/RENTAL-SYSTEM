const { sql, poolPromise } = require("../db/mssqlClient");

// GET ALL
exports.getCustomers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Customers ORDER BY CustomerID DESC");
    res.json(result.recordset || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getCustomerById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const id = req.params.id;

    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Customers WHERE CustomerID = @id");

    if (!result.recordset[0]) return res.status(404).json({ message: "Not found" });

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createCustomer = async (req, res) => {
  try {
    const { CustName, CustEmail, CustPhone, CustAddress, CustDLNum } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("n", sql.VarChar, CustName)
      .input("e", sql.VarChar, CustEmail)
      .input("p", sql.VarChar, CustPhone)
      .input("a", sql.VarChar, CustAddress)
      .input("dl", sql.VarChar, CustDLNum)
      .query(`
        INSERT INTO Customers (CustName, CustEmail, CustPhone, CustAddress, CustDLNum)
        VALUES (@n, @e, @p, @a, @dl)
      `);

    res.json({ message: "Customer created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  try {
    const { CustName, CustEmail, CustPhone, CustAddress, CustDLNum } = req.body;
    const id = req.params.id;

    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .input("n", sql.VarChar, CustName)
      .input("e", sql.VarChar, CustEmail)
      .input("p", sql.VarChar, CustPhone)
      .input("a", sql.VarChar, CustAddress)
      .input("dl", sql.VarChar, CustDLNum)
      .query(`
        UPDATE Customers SET
        CustName=@n, CustEmail=@e, CustPhone=@p, CustAddress=@a, CustDLNum=@dl
        WHERE CustomerID=@id
      `);

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ONE
exports.deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Customers WHERE CustomerID=@id");

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// DELETE ALL
exports.deleteAllCustomers = async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request().query("DELETE FROM Customers");

    res.json({ message: "All customers deleted successfully" });
  } catch (err) {
    console.error("Error deleting all customers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ===============================
// SEARCH CUSTOMERS
// ===============================
exports.searchCustomers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const kw = req.params.keyword;

    const result = await pool.request()
      .input("kw", sql.VarChar(50), `%${kw}%`)
      .query(`
        SELECT *
        FROM Customers
        WHERE CustName LIKE @kw
           OR CustEmail LIKE @kw
           OR CustPhone LIKE @kw
           OR CustDLNum LIKE @kw
      `);

    res.json(result.recordset || []);
  } catch (err) {
    console.error("Error searching customers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
