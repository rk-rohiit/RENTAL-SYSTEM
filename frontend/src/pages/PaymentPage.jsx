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
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getPaymentsJoin,
  createPayment,
  deletePayment,
  deleteAllPayments,
  getRentalsJoin,
  searchPayments,
} from "../services/paymentService";

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [form, setForm] = useState({
    RentalID: "",
    PayAmount: "",
    PaymentMethod: "Cash",
    TransactionID: "",
  });

  // Load Data
 const loadData = async () => {
  const p = await getPaymentsJoin();   // <-- FIXED
  const r = await getRentalsJoin();

  setPayments(p.data || []);
  setRentals(r.data || []);
};

  useEffect(() => {
    loadData();
  }, []);

  /*************************
   * SEARCH PAYMENTS
   *************************/
  const handleSearch = async (e) => {
    const kw = e.target.value;
    setKeyword(kw);

    if (kw.trim() === "") {
      loadData();
      return;
    }

    const res = await searchPayments(kw);
    setPayments(res.data || []);
  };

  /*************************
   * ADD PAYMENT OPEN FORM
   *************************/
  const handleAdd = () => {
    setForm({
      RentalID: "",
      PayAmount: "",
      PaymentMethod: "Cash",
      TransactionID: "",
    });
    setOpenForm(true);
  };

  /*************************
   * SAVE PAYMENT
   *************************/
 const handleSave = async () => {
  const newForm = {
    ...form,
    TransactionID: form.TransactionID || generateTransactionID()
  };

  await createPayment(newForm);
  setOpenForm(false);
  loadData();
};

  /*************************
   * DELETE ONE PAYMENT
   *************************/
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    await deletePayment(id);
    loadData();
  };

  /*************************
   * DELETE ALL PAYMENTS
   *************************/
  const handleDeleteAll = async () => {
    await deleteAllPayments();
    setOpenDeleteDialog(false);
    loadData();
  };
  const generateTransactionID = () => {
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `TXN${timestamp}${random}`;
};


  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Payments Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{ backgroundColor: "#cc0102", "&:hover": { backgroundColor: "#a00001" } }}
            onClick={handleAdd}
          >
            Add Payment
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete All
          </Button>
        </Box>
      </Box>

      {/* SEARCH FIELD */}
      <TextField
        placeholder="Search Payments..."
        value={keyword}
        onChange={handleSearch}
        sx={{ width: 280, mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#888" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* PAYMENTS TABLE */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Payment Records
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Vehicle</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Method</b></TableCell>
              <TableCell><b>Transaction ID</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <TableRow key={p.PaymentID}>
                  <TableCell>{p.CustName}</TableCell>
                  <TableCell>{p.VehModel}</TableCell>
                  <TableCell>₹{p.PayAmount}</TableCell>
                  <TableCell>{p.PaymentMethod}</TableCell>
                  <TableCell>{p.TransactionID}</TableCell>
                  <TableCell>{p.PaymentDate}</TableCell>

                  <TableCell>
                    <Button color="error" onClick={() => handleDelete(p.PaymentID)}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ADD PAYMENT FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent dividers>
          {/* Rental Select */}
          <TextField
            select
            label="Select Rental"
            fullWidth
            margin="normal"
            value={form.RentalID}
            name="RentalID"
            onChange={(e) => setForm({ ...form, RentalID: e.target.value })}
          >
            {rentals.map((r) => (
              <MenuItem key={r.RentalID} value={r.RentalID}>
                #{r.RentalID} — {r.CustName} ({r.VehModel})
              </MenuItem>
            ))}
          </TextField>

          {/* Amount */}
          <TextField
            label="Amount"
            fullWidth
            type="number"
            margin="normal"
            value={form.PayAmount}
            onChange={(e) => setForm({ ...form, PayAmount: e.target.value })}
          />

          {/* Payment Method */}
          <TextField
            select
            label="Payment Method"
            fullWidth
            margin="normal"
            value={form.PaymentMethod}
            onChange={(e) => setForm({ ...form, PaymentMethod: e.target.value })}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </TextField>

          {/* Transaction ID */}
          <TextField
            label="Transaction ID will be auto-generated"
            fullWidth
            margin="normal"
            value={form.TransactionID}
            onChange={(e) => setForm({ ...form, TransactionID: e.target.value })}
            disabled
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#cc0102", "&:hover": { backgroundColor: "#a00001" } }}
            onClick={handleSave}
          >
            Save Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRM DELETE ALL */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs">
        <DialogTitle>Delete ALL Payments?</DialogTitle>
        <DialogContent dividers>
          This action <b>cannot be undone</b>. All payments will be removed.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteAll}>Delete All</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentPage;
