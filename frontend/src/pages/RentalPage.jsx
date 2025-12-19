import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  getCustomers,
  getVehiclesAvailable,
  createRental,
  getRentalsJoin,
  deleteRental,
  updateRentalStatus,
} from "../services/rentalService";

const RentalPage = () => {
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [openForm, setOpenForm] = useState(false);

  const [form, setForm] = useState({
    CustomerID: "",
    VehicleID: "",
    PickupDate: "",
    ReturnDate: "",
    RentTotAmt: 0,
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Load Customers, Vehicles, Rentals (JOIN)
  const loadData = async () => {
    const c = await getCustomers();
    const v = await getVehiclesAvailable();
    const r = await getRentalsJoin();

    setCustomers(c.data || []);
    setVehicles(v.data || []);
    setRentals(r.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // When selecting a vehicle, auto-fill price
  const handleVehicleChange = (id) => {
    const vehicle = vehicles.find((v) => v.VehicleID == id);
    setSelectedVehicle(vehicle);

    setForm({
      ...form,
      VehicleID: id,
      RentTotAmt: form.PickupDate && form.ReturnDate ?
        calcTotal(form.PickupDate, form.ReturnDate, vehicle.VehRentRatePerDay) :
        0
    });
  };

  // Calculate number of days * rate
  const calcTotal = (pickup, returning, rate) => {
    const d1 = new Date(pickup);
    const d2 = new Date(returning);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff * rate : 0;
  };

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      if (updated.PickupDate && updated.ReturnDate && selectedVehicle) {
        updated.RentTotAmt = calcTotal(
          updated.PickupDate,
          updated.ReturnDate,
          selectedVehicle.VehRentRatePerDay
        );
      }

      return updated;
    });
  };

  // Save Rental
  const handleSave = async () => {
    await createRental(form);
    setOpenForm(false);
    loadData();
  };

  // Delete rental
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rental?")) return;
    await deleteRental(id);
    loadData();
  };
  const handleStatusChange = async (rentalId, newStatus) => {
    await updateRentalStatus(rentalId, {
      RentalStatus: newStatus,
      ActualReturnDate: newStatus === "Completed" ? new Date() : null,
    });

    loadData(); // refresh table
  };


  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Rental Management
        </Typography>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#cc0102", "&:hover": { backgroundColor: "#a00001" } }}
          onClick={() => setOpenForm(true)}
        >
          New Rental
        </Button>
      </Box>

      {/* Rentals History Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Rental History
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Vehicle</b></TableCell>
              <TableCell><b>Pickup</b></TableCell>
              <TableCell><b>Return</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Total</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rentals.length > 0 ? (
              rentals.map((r) => (
                <TableRow key={r.RentalID}>
                  <TableCell>{r.CustName}</TableCell>
                  <TableCell>{r.VehModel}</TableCell>
                  <TableCell>{r.PickupDate}</TableCell>
                  <TableCell>{r.ReturnDate}</TableCell>
                <TableCell>
  {r.RentalStatus === "Completed" ? (
    <Typography
      sx={{
        fontWeight: 600,
        color: "green",
      }}
    >
      Completed
    </Typography>
  ) : (
    <TextField
      select
      size="small"
      value={r.RentalStatus}
      onChange={(e) => handleStatusChange(r.RentalID, e.target.value)}
      sx={{ minWidth: 120 }}
    >
      <MenuItem value="Booked">Booked</MenuItem>
      <MenuItem value="Completed">Completed</MenuItem>
    </TextField>
  )}
</TableCell>

                  <TableCell>₹{r.RentTotAmt}</TableCell>

                  <TableCell>
                    <Button color="error" onClick={() => handleDelete(r.RentalID)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  No rentals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Rental Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Rental</DialogTitle>

        <DialogContent dividers>
          {/* Customer */}
          <TextField
            select
            label="Select Customer"
            fullWidth
            margin="normal"
            name="CustomerID"
            value={form.CustomerID}
            onChange={handleChange}
          >
            {customers.map((c) => (
              <MenuItem key={c.CustomerID} value={c.CustomerID}>
                {c.CustName}
              </MenuItem>
            ))}
          </TextField>

          {/* Vehicle */}
          <TextField
            select
            label="Select Vehicle"
            fullWidth
            margin="normal"
            name="VehicleID"
            value={form.VehicleID}
            onChange={(e) => handleVehicleChange(e.target.value)}
          >
            {vehicles.map((v) => (
              <MenuItem key={v.VehicleID} value={v.VehicleID}>
                {v.VehModel} - ₹{v.VehRentRatePerDay}/day
              </MenuItem>
            ))}
          </TextField>

          {/* Dates */}
          <TextField
            type="date"
            label="Pickup Date"
            name="PickupDate"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.PickupDate}
            onChange={handleChange}
          />

          <TextField
            type="date"
            label="Return Date"
            name="ReturnDate"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.ReturnDate}
            onChange={handleChange}
          />

          {/* Total */}
          <TextField
            label="Total Amount"
            fullWidth
            margin="normal"
            disabled
            value={form.RentTotAmt}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#cc0102", "&:hover": { backgroundColor: "#a00001" } }}
            onClick={handleSave}
          >
            Save Rental
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RentalPage;
