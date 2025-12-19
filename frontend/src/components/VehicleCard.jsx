import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";

import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import ElectricBikeIcon from "@mui/icons-material/ElectricBike";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function VehicleCard({ vehicle, onEdit, onDelete }) {
  const typeIcon =
    vehicle.VehType === "Car" ? (
      <DirectionsCarFilledIcon fontSize="large" />
    ) : (
      <ElectricBikeIcon fontSize="large" />
    );

  /* ================= STATUS COLORS ================= */
  const statusMap = {
    Available: { color: "#2e7d32", bg: "rgba(46,125,50,0.12)" },
    Rented: { color: "#ed6c02", bg: "rgba(237,108,2,0.12)" },
    Maintenance: { color: "#616161", bg: "rgba(97,97,97,0.15)" },
  };

  const status = statusMap[vehicle.VehAvai] || statusMap.Available;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "all 0.25s ease",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 26px rgba(0,0,0,0.12)",
          borderColor: "primary.main",
        },
      }}
    >
      {/* ===== STATUS CHIP ===== */}
      <Box sx={{ position: "absolute", top: 12, right: 12 }}>
        <Chip
          label={vehicle.VehAvai}
          size="small"
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            color: status.color,
            backgroundColor: status.bg,
            borderRadius: 1.5,
          }}
        />
      </Box>

      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {/* ===== ICON ===== */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            p: 2,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(204,1,2,0.08), rgba(204,1,2,0.18))",
            color: "primary.main",
          }}
        >
          {typeIcon}
        </Box>

        {/* ===== TITLE ===== */}
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          {vehicle.VehComp} {vehicle.VehModel}
        </Typography>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="text.secondary"
          mb={2}
        >
          {vehicle.VehType}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* ===== DETAILS ===== */}
        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" flex={1}>
              Year
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {vehicle.VehYear}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SpeedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" flex={1}>
              Mileage
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {vehicle.VehMileage} km
            </Typography>
          </Box>
        </Stack>

        {/* ===== RATE ===== */}
        <Box
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: 2,
            background:
              "linear-gradient(135deg, #fff7ed, #ffe0b2)",
            border: "1px solid rgba(255,152,0,0.35)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
          >
            Daily Rent
          </Typography>

          <Typography
            variant="h5"
            fontWeight={700}
            color="secondary.main"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={0.5}
          >
            <CurrencyRupeeIcon fontSize="small" />
            {vehicle.VehRentRatePerDay}
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
            >
              /day
            </Typography>
          </Typography>
        </Box>
      </CardContent>

      <Divider />

      {/* ===== ACTIONS ===== */}
      <CardActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
          fullWidth
          sx={{
            mr: 1,
            borderRadius: 2,
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "#a00001",
            },
          }}
        >
          Edit
        </Button>

        <Tooltip title="Delete Vehicle">
          <IconButton
            onClick={onDelete}
            sx={{
              border: "1px solid",
              borderColor: "error.main",
              color: "error.main",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(211,47,47,0.08)",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
