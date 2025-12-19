import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Paper,
  Chip,
  Dialog
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";

import {
  getVehicles,
  deleteVehicle,
  searchVehicles,
  filterVehicles,
  sortVehicles,
} from "../services/vehiclesService";

import VehicleCard from "../components/VehicleCard";
import { useNavigate } from "react-router-dom";
import VehicleForm from "../pages/VehicleForm";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [sortKey, setSortKey] = useState("default");
  const [openForm, setOpenForm] = useState(false);

  const navigate = useNavigate();

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const res = await getVehicles();
      setVehicles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setVehicles([]);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Delete vehicle
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    await deleteVehicle(id);
    fetchVehicles();
  };

  // Search
 const handleSearch = async (e) => {
  const kw = e.target.value;
  setKeyword(kw);

  if (kw.trim() === "") return applyFilters();

  const res = await searchVehicles(kw);
  setVehicles(res.data || []);
};



  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      
      {/* Header */}
      <Box
  sx={{
    mb: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
  }}
>
  <Box>
    <Typography variant="h4" fontWeight={700}>
      Vehicle Management
    </Typography>

    <Typography
      variant="body2"
      sx={{
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        gap: 1,
        mt: 0.5,
      }}
    >
      Manage, search & organize all vehicles
      <Chip
        label={`${vehicles.length} Vehicles`}
        size="small"
        color="primary"
        variant="outlined"
      />
    </Typography>
  </Box>

  <Button
    variant="contained"
    startIcon={<AddCircleIcon />}
    onClick={() => setOpenForm(true)}
    sx={{
      background: "#cc0102",
      px: 3,
      py: 1.2,
      borderRadius: 2,
      boxShadow: "0 6px 16px rgba(204,1,2,0.35)",
      "&:hover": {
        background: "#b00001",
        transform: "translateY(-2px)",
      },
      transition: "0.25s",
    }}
  >
    Add Vehicle
  </Button>
</Box>


      {/* Search + Filters */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Search by name, model or plate..."
            value={keyword}
            onChange={handleSearch}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

       
      </Paper>

      {/* Vehicle Cards */}
      <Box sx={{ mt: 2 }}>
  <Grid container spacing={3}>
    {vehicles.length > 0 ? (
      vehicles.map((v) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={v.VehicleID}>
          <VehicleCard
            vehicle={v}
            onEdit={() => navigate(`/vehicles/${v.VehicleID}/edit`)}
            onDelete={() => handleDelete(v.VehicleID)}
          />
        </Grid>
      ))
    ) : (
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
            backgroundColor: "background.default",
          }}
        >
          <Typography variant="h6" sx={{ mt: 2 }}>
            No Vehicles Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      </Grid>
    )}
  </Grid>
</Box>


      {/* ==============================
          ADD / EDIT VEHICLE POPUP
      ============================== */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        scroll="body"
        PaperProps={{
          sx: {
            overflow: "visible",
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0px 10px 35px rgba(0,0,0,0.3)",
            p: 1.5,
          },
        }}
        sx={{
          "& .MuiDialogContent-root": {
            p: 0,
          },
        }}
      >
        <VehicleForm
          onClose={() => {
            setOpenForm(false);
            fetchVehicles();
          }}
        />
      </Dialog>
    </Box>
  );
}
