import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress
} from "@mui/material";

import {
  createVehicle,
  getVehicle,
  updateVehicle,
} from "../services/vehiclesService";

import { useNavigate, useParams } from "react-router-dom";

import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import ElectricBikeIcon from "@mui/icons-material/ElectricBike";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SpeedIcon from "@mui/icons-material/Speed";

export default function VehicleForm({ onClose }) {
  const [form, setForm] = useState({
    VehComp: "",
    VehModel: "",
    VehYear: 2023,
    VehNum: "",
    VehType: "Car",
    VehRentRatePerDay: 0,
    VehMileage: 0,
    VehAvai: "Available",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // edit mode

  // Fetch vehicle when editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      getVehicle(id)
        .then((res) => {
          if (res.data) setForm(res.data);
        })
        .catch((err) => console.error("Fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // FIX: Convert number fields properly
  const handleChange = (e) => {
    let { name, value } = e.target;

    // numeric conversions
    if (["VehYear", "VehRentRatePerDay", "VehMileage"].includes(name)) {
      value = Number(value);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend requires EXCAT SAME FIELD NAMES
      const payload = {
        VehComp: form.VehComp,
        VehModel: form.VehModel,
        VehYear: Number(form.VehYear),
        VehNum: form.VehNum,
        VehType: form.VehType,
        VehRentRatePerDay: Number(form.VehRentRatePerDay),
        VehMileage: Number(form.VehMileage),
        VehAvai: form.VehAvai,
      };

      console.log("SUBMIT PAYLOAD:", payload); // 🔍 debugging

      if (id) {
        await updateVehicle(id, payload);
        alert("Vehicle updated successfully!");
      } else {
        await createVehicle(payload);
        alert("Vehicle added successfully!");
      }

      if (onClose) onClose();
      else navigate("/vehicles");

    } catch (error) {
      console.error("SAVE ERROR (Frontend):", error);
      alert("Save failed! Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: "auto" }}>
      {/* Back button for page mode */}
      {!onClose && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/vehicles")}
          sx={{ mb: 2 }}
        >
          Back to Vehicles
        </Button>
      )}

      {/* HEADER */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          {form.VehType === "Car" ? (
            <DirectionsCarFilledIcon sx={{ fontSize: 36, color: "primary.main" }} />
          ) : (
            <ElectricBikeIcon sx={{ fontSize: 36, color: "primary.main" }} />
          )}
        </Paper>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {id ? "Update Vehicle" : "Add New Vehicle"}
          </Typography>
        </Box>
      </Box>

      {/* FORM CARD */}
      <Card sx={{ borderRadius: 3, border: "1px solid #ddd" }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            
            {/* BASIC INFO */}
            <Typography variant="h6" sx={{ mb: 1 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vehicle Company"
                  name="VehComp"
                  fullWidth
                  required
                  value={form.VehComp}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Model Name"
                  name="VehModel"
                  fullWidth
                  required
                  value={form.VehModel}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Manufacture Year"
                  name="VehYear"
                  type="number"
                  fullWidth
                  required
                  value={form.VehYear}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vehicle Number"
                  name="VehNum"
                  fullWidth
                  required
                  value={form.VehNum}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Vehicle Type"
                  name="VehType"
                  fullWidth
                  value={form.VehType}
                  onChange={handleChange}
                >
                  <MenuItem value="Car">Car</MenuItem>
                  <MenuItem value="Bike">Bike</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Availability"
                  name="VehAvai"
                  fullWidth
                  value={form.VehAvai}
                  onChange={handleChange}
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Rented">Rented</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* PRICING */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Pricing & Technical Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rate Per Day (₹)"
                  name="VehRentRatePerDay"
                  type="number"
                  fullWidth
                  required
                  value={form.VehRentRatePerDay}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mileage (km)"
                  name="VehMileage"
                  type="number"
                  fullWidth
                  value={form.VehMileage}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* ACTION BUTTONS */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              
              <Button
                variant="outlined"
                onClick={() => (onClose ? onClose() : navigate("/vehicles"))}
              >
                Cancel
              </Button>

              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={22} /> : id ? "Update" : "Save"}
              </Button>

            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
