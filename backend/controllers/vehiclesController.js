const { poolPromise, sql } = require('../db/mssqlClient');

exports.getAllVehicles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Vehicles');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Vehicles WHERE VehicleID = @id');
    res.json(result.recordset[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const { VehComp, VehModel, VehYear, VehNum, VehType, VehRentRatePerDay, VehMileage } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('VehComp', sql.VarChar(50), VehComp)
      .input('VehModel', sql.VarChar(50), VehModel)
      .input('VehYear', sql.Int, VehYear)
      .input('VehNum', sql.VarChar(20), VehNum)
      .input('VehType', sql.VarChar(30), VehType)
      .input('VehRentRatePerDay', sql.Decimal(10,2), VehRentRatePerDay)
      .input('VehMileage', sql.Int, VehMileage)
      .query(`INSERT INTO Vehicles (VehComp, VehModel, VehYear, VehNum, VehType, VehRentRatePerDay, VehMileage)
              VALUES (@VehComp,@VehModel,@VehYear,@VehNum,@VehType,@VehRentRatePerDay,@VehMileage);
              SELECT SCOPE_IDENTITY() AS VehicleID;`);
    res.status(201).json({ VehicleID: result.recordset[0].VehicleID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { VehComp, VehModel, VehYear, VehNum, VehType, VehRentRatePerDay, VehMileage, VehAvai } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('VehComp', sql.VarChar(50), VehComp)
      .input('VehModel', sql.VarChar(50), VehModel)
      .input('VehYear', sql.Int, VehYear)
      .input('VehNum', sql.VarChar(20), VehNum)
      .input('VehType', sql.VarChar(30), VehType)
      .input('VehRentRatePerDay', sql.Decimal(10,2), VehRentRatePerDay)
      .input('VehMileage', sql.Int, VehMileage)
      .input('VehAvai', sql.VarChar(20), VehAvai)
      .query(`UPDATE Vehicles SET
                VehComp=@VehComp, VehModel=@VehModel, VehYear=@VehYear,
                VehNum=@VehNum, VehType=@VehType, VehRentRatePerDay=@VehRentRatePerDay,
                VehMileage=@VehMileage, VehAvai=@VehAvai
              WHERE VehicleID = @id`);
    res.json({ message: 'Vehicle updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Vehicles WHERE VehicleID = @id');
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT VehicleID, VehComp, VehModel, VehRentRatePerDay, VehAvai 
      FROM Vehicles
      WHERE VehAvai = 'Available'
      ORDER BY VehicleID DESC
    `);

    res.json(result.recordset || []);
  } catch (err) {
    console.error("Error fetching available vehicles:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.filterVehicles = async (req, res) => {
  try {
    const { type, availability } = req.query;

    let query = "SELECT * FROM Vehicles WHERE 1=1";

    if (type && type !== "All") {
      query += ` AND VehType = @type`;
    }

    if (availability && availability !== "All") {
      query += ` AND VehAvai = @availability`;
    }

    const pool = await poolPromise;
    const request = pool.request();

    if (type && type !== "All") request.input("type", sql.VarChar, type);
    if (availability && availability !== "All") request.input("availability", sql.VarChar, availability);

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.sortVehicles = async (req, res) => {
  try {
    const { key } = req.params;

    let orderBy = "";

    switch (key) {
      case "year":
        orderBy = "VehYear DESC";
        break;
      case "rate":
        orderBy = "VehRentRatePerDay ASC";
        break;
      case "mileage":
        orderBy = "VehMileage ASC";
        break;
      default:
        orderBy = "VehicleID ASC";
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM Vehicles ORDER BY ${orderBy}`);

    res.json(result.recordset);
  } catch (err) {
    console.error("Sort Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.searchVehicles = async (req, res) => {
  try {
    const keyword = `%${req.params.keyword}%`;

    const pool = await poolPromise;
    const result = await pool.request()
      .input("kw", sql.VarChar, keyword)
      .query(`
        SELECT * FROM Vehicles 
        WHERE VehComp LIKE @kw 
        OR VehModel LIKE @kw
        OR VehNum LIKE @kw
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Search Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

