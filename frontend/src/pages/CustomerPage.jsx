import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  deleteAllCustomers,
  searchCustomers,
} from "../services/customersService";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [keyword, setKeyword] = useState("");

  // For Add/Edit Modal
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    CustName: "",
    CustEmail: "",
    CustPhone: "",
    CustAddress: "",
    CustDLNum: "",
  });

  // Delete All Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Load customers
  const loadCustomers = async () => {
    const res = await getCustomers();
    setCustomers(res.data || []);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  /***********************
   * SEARCH CUSTOMERS
   ***********************/
  const handleSearch = async (e) => {
    const kw = e.target.value;
    setKeyword(kw);

    if (kw.trim() === "") {
      loadCustomers();
      return;
    }
    const res = await searchCustomers(kw);
    setCustomers(res.data || []);
  };

  /***********************
   * OPEN ADD FORM
   ***********************/
  const handleAdd = () => {
    setEditId(null);
    setForm({
      CustName: "",
      CustEmail: "",
      CustPhone: "",
      CustAddress: "",
      CustDLNum: "",
    });
    setOpenForm(true);
  };

  /***********************
   * OPEN EDIT FORM
   ***********************/
  const handleEdit = (customer) => {
    setEditId(customer.CustomerID);
    setForm(customer);
    setOpenForm(true);
  };

  /***********************
   * SAVE CUSTOMER (ADD/UPDATE)
   ***********************/
  const handleSave = async () => {
    if (editId) {
      await updateCustomer(editId, form);
    } else {
      await createCustomer(form);
    }
    setOpenForm(false);
    loadCustomers();
  };

  /***********************
   * DELETE ONE CUSTOMER
   ***********************/
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await deleteCustomer(id);
    loadCustomers();
  };

  /***********************
   * DELETE ALL CUSTOMERS
   ***********************/
  const handleDeleteAll = async () => {
    await deleteAllCustomers();
    setOpenDeleteDialog(false);
    loadCustomers();
  };

  return (
    <Box>
      {/* PAGE HEADER */}
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
          Customers Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleAdd}
            sx={{
              backgroundColor: "#cc0102",
              "&:hover": { backgroundColor: "#a00001" },
            }}
          >
            Add Customer
          </Button>

          <Button
            variant="outlined"
            startIcon={<DeleteSweepIcon />}
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete All
          </Button>
        </Box>
      </Box>

      {/* SEARCH BOX */}
      <TextField
        placeholder="Search customers..."
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

      {/* CUSTOMER TABLE */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Phone</b></TableCell>
              <TableCell><b>DL Number</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <TableRow key={c.CustomerID}>
                  <TableCell>{c.CustName}</TableCell>
                  <TableCell>{c.CustEmail}</TableCell>
                  <TableCell>{c.CustPhone}</TableCell>
                  <TableCell>{c.CustDLNum}</TableCell>
                  <TableCell>{c.CustAddress}</TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(c)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton color="error" onClick={() => handleDelete(c.CustomerID)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center", opacity: 0.6 }}>
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* ADD/EDIT FORM DIALOG */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.CustName}
            onChange={(e) => setForm({ ...form, CustName: e.target.value })}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={form.CustEmail}
            onChange={(e) => setForm({ ...form, CustEmail: e.target.value })}
          />

          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={form.CustPhone}
            onChange={(e) => setForm({ ...form, CustPhone: e.target.value })}
          />

          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={form.CustAddress}
            onChange={(e) => setForm({ ...form, CustAddress: e.target.value })}
          />

          <TextField
            label="Driving License Number"
            fullWidth
            margin="normal"
            value={form.CustDLNum}
            onChange={(e) => setForm({ ...form, CustDLNum: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#cc0102", "&:hover": { backgroundColor: "#a00001" } }}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE ALL CONFIRM DIALOG */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
      >
        <DialogTitle>Delete ALL Customers?</DialogTitle>
        <DialogContent dividers>
          This action <b>cannot be undone</b>. All customer records will be permanently
          deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteAll}>
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerPage;
